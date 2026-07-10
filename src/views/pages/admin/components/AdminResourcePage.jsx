import PropTypes from 'prop-types';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useToast } from 'services/toastService';
import { formatDate } from 'utils/masks';

function getNestedValue(row, field) {
  return field.split('.').reduce((value, key) => value?.[key], row);
}

function formatCellValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? '' : 's'}`;
  }

  if (typeof value === 'object') {
    return value.name || value.title || value.description || '-';
  }

  return value;
}

function isDateField(field) {
  return /(^|_)(date|at)$|date|_at$/i.test(field);
}

function getColumnValue(row, column) {
  const value = getNestedValue(row, column.field);

  if (column.format) {
    return column.format(value, row);
  }

  if (isDateField(column.field)) {
    return formatDate(value);
  }

  return formatCellValue(value);
}

function getResponseItems(response, paginated) {
  if (paginated) {
    return response.data || [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  return response.data || [];
}

export default function AdminResourcePage({ columns, description, getData, paginated = true, title }) {
  const toast = useToast();
  const [items, setItems] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [error, setError] = React.useState('');
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const hasLoadedRef = React.useRef(false);

  const loadItems = React.useCallback(async () => {
    const isFirstLoad = !hasLoadedRef.current;

    if (isFirstLoad) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError('');

    try {
      const response = paginated ? await getData({ page: currentPage, perPage }) : await getData();
      const responseItems = getResponseItems(response, paginated);
      const meta = response.meta || {};

      setItems(responseItems);
      setTotal(meta.total ?? responseItems.length);
      setPerPage(paginated ? meta.per_page ?? perPage : responseItems.length || perPage);
      setCurrentPage(paginated ? meta.current_page ?? currentPage : 1);
      setLastPage(paginated ? meta.last_page ?? 1 : 1);
      hasLoadedRef.current = true;
    } catch (requestError) {
      const message = requestError.message || `Erro ao carregar ${title.toLowerCase()}.`;
      setError(message);
      toast.error(message);
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, getData, paginated, perPage, title, toast]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
          {description}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label={`Tabela de ${title}`}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isInitialLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!isInitialLoading &&
                items.map((item, index) => (
                  <TableRow hover key={item.id || item.uuid || index}>
                    {columns.map((column) => (
                      <TableCell key={column.field}>{getColumnValue(item, column)}</TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isInitialLoading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum registro encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isRefreshing && <LinearProgress />}

        {paginated ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Página {currentPage} de {lastPage} - {total} registro{total === 1 ? '' : 's'}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <TextField select label="Itens por página" size="small" value={perPage} onChange={handleChangeRowsPerPage} sx={{ minWidth: 150 }}>
                {[10, 25, 50].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Pagination
                color="primary"
                count={lastPage}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                disabled={isInitialLoading || isRefreshing || lastPage <= 1}
                showFirstButton
                showLastButton
              />
            </Stack>
          </Stack>
        ) : (
          <Stack sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {total} registro{total === 1 ? '' : 's'}
            </Typography>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

AdminResourcePage.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      format: PropTypes.func
    })
  ).isRequired,
  description: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  paginated: PropTypes.bool,
  title: PropTypes.string.isRequired
};
