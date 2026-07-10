import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { IconPlus } from '@tabler/icons-react';

import { getClients } from 'api/clients';
import MainCard from 'ui-component/cards/MainCard';
import { useToast } from 'services/toastService';
import { formatCPFOrCNPJToView, formatCellphoneToView, formatDate, onlyNumbers } from 'utils/masks';
import ClientFormDialog from './components/ClientFormDialog';

// ==============================|| CLIENTS ||============================== //

function normalizeClient(client) {
  return {
    ...client,
    birthdateLabel: formatDate(client.birthdate),
    cpfOrCnpjLabel: formatCPFOrCNPJToView(client.cpf_or_cnpj),
    cellphoneLabel: formatCellphoneToView(client.cellphone)
  };
}

export default function ClientsPage() {
  const toast = useToast();
  const [clients, setClients] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('name');
  const [appliedSearch, setAppliedSearch] = React.useState('');
  const [appliedSearchType, setAppliedSearchType] = React.useState('name');
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isClientFormOpen, setIsClientFormOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(null);
  const hasLoadedClientsRef = React.useRef(false);

  const loadClients = React.useCallback(async () => {
    const isFirstLoad = !hasLoadedClientsRef.current;

    if (isFirstLoad) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError('');

    try {
      const response = await getClients({
        page: currentPage,
        perPage,
        search: appliedSearch,
        searchType: appliedSearchType
      });

      const responseClients = response.data || [];
      const meta = response.meta || {};

      setClients(responseClients.map(normalizeClient));
      setTotal(meta.total ?? responseClients.length);
      setPerPage(meta.per_page ?? perPage);
      setCurrentPage(meta.current_page ?? currentPage);
      setLastPage(meta.last_page ?? 1);
      hasLoadedClientsRef.current = true;
    } catch (requestError) {
      setError(requestError.message || 'Erro ao carregar clientes.');
      toast.error(requestError.message || 'Erro ao carregar clientes.');
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [appliedSearch, appliedSearchType, currentPage, perPage, toast]);

  React.useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search);
    setAppliedSearchType(searchType);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setAppliedSearch('');
    setAppliedSearchType(searchType);
    setCurrentPage(1);
  };

  const handleChangeSearch = (event) => {
    const value = event.target.value;

    setSearch(searchType === 'cpf_or_cnpj' ? onlyNumbers(value) : value);
  };

  const handleChangeSearchType = (event) => {
    const nextSearchType = event.target.value;

    setSearchType(nextSearchType);
    setSearch(nextSearchType === 'cpf_or_cnpj' ? onlyNumbers(search) : search);
  };

  const handleClientSaved = React.useCallback(async () => {
    await loadClients();
  }, [loadClients]);

  const handleOpenCreateClient = () => {
    setSelectedClient(null);
    setIsClientFormOpen(true);
  };

  const handleOpenEditClient = (client) => {
    setSelectedClient(client);
    setIsClientFormOpen(true);
  };

  const handleCloseClientForm = () => {
    setIsClientFormOpen(false);
    setSelectedClient(null);
  };

  return (
    <>
      <MainCard
        title="Clientes"
        secondary={
          <Button type="button" variant="contained" startIcon={<IconPlus size={18} />} onClick={handleOpenCreateClient}>
            Novo cliente
          </Button>
        }
      >
        <Stack spacing={2}>
          <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1.5} onSubmit={handleSearch}>
            <TextField
              select
              label="Buscar por"
              value={searchType}
              onChange={handleChangeSearchType}
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 160 } }}
            >
              <MenuItem value="name">Nome</MenuItem>
              <MenuItem value="cpf_or_cnpj">CPF/CNPJ</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label={searchType === 'cpf_or_cnpj' ? 'Digite o CPF ou CNPJ' : 'Digite o nome do cliente'}
              value={search}
              onChange={handleChangeSearch}
              size="small"
              InputProps={{
                startAdornment: appliedSearch ? (
                  <InputAdornment position="start">
                    <Typography variant="caption" color="text.secondary">
                      filtrando
                    </Typography>
                  </InputAdornment>
                ) : null
              }}
            />
            <Button type="submit" variant="outlined" disabled={isInitialLoading || isRefreshing}>
              Pesquisar
            </Button>
            <Button type="button" color="inherit" disabled={isInitialLoading || isRefreshing || (!search && !appliedSearch)} onClick={handleClearSearch}>
              Limpar
            </Button>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>CPF/CNPJ</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Data de nascimento</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isInitialLoading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  )}

                  {!isInitialLoading &&
                    clients.map((client) => (
                      <TableRow hover key={client.id || client.cpf_or_cnpj || client.email}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.cpfOrCnpjLabel}</TableCell>
                        <TableCell>{client.cellphoneLabel}</TableCell>
                        <TableCell>{client.email || '-'}</TableCell>
                        <TableCell>{client.birthdateLabel}</TableCell>
                        <TableCell>
                          <Button type="button" variant="outlined" size="small" onClick={() => handleOpenEditClient(client)}>
                            Ver/Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                  {!isInitialLoading && clients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Nenhum cliente encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {isRefreshing && <LinearProgress />}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
              sx={{ p: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Página {currentPage} de {lastPage} - {total} cliente{total === 1 ? '' : 's'}
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
                  onChange={handleChangePage}
                  disabled={isInitialLoading || isRefreshing || lastPage <= 1}
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </MainCard>

      <ClientFormDialog open={isClientFormOpen} client={selectedClient} onClose={handleCloseClientForm} onSaved={handleClientSaved} />
    </>
  );
}
