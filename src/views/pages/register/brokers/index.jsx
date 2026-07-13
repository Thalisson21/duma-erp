import * as React from 'react';
import { useToast } from 'services/toastService';

//components
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
import MainCard from 'ui-component/cards/MainCard';

//api
import { getBrokers, viewBroker } from 'api/register/brokers';

//utils
import { formatCPFOrCNPJToView, formatCellphoneToView, formatDate, onlyNumbers } from 'utils/masks';

//components
import BrokerFormDialog from './components/BrokerFormDialog';

function getBrokerFromResponse(response) {
  const broker = response?.broker || response?.data?.broker || response?.data || response;

  if (Array.isArray(broker)) {
    return broker[0] || null;
  }

  return broker;
}

export default function BrokersPage() {
  const toast = useToast();
  const [brokers, setBrokers] = React.useState([]);
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
  const [isBrokerFormOpen, setIsBrokerFormOpen] = React.useState(false);
  const [selectedBroker, setSelectedBroker] = React.useState(null);
  const [viewingBrokerId, setViewingBrokerId] = React.useState(null);
  const hasLoadedBrokersRef = React.useRef(false);
  
  const loadBrokers = React.useCallback(async ()=> {
    const isFirstLoad = !hasLoadedBrokersRef.current;

    if (isFirstLoad) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError('');

    try {
      const response = await getBrokers({
        page: currentPage,
        perPage,
        search: appliedSearch,
        searchType: appliedSearchType
      });

      const responseBrokers = response.brokers.data || [];
      const meta = response.brokers.meta || {};

      setBrokers(responseBrokers);
      setTotal(meta.total ?? responseBrokers.length);
      setPerPage(meta.per_page ?? perPage);
      setCurrentPage(meta.current_page ?? currentPage);
      setLastPage(meta.last_page ?? 1);
    } catch (requestError) {
      setError(requestError.message || 'Erro ao carregar corretores.');
      toast.error(requestError.message || 'Erro ao carregar corretores.');
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [appliedSearch, appliedSearchType, currentPage, perPage, toast]);

  React.useEffect(() => {
    loadBrokers();
  }, [loadBrokers]);

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  }

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search);
    setAppliedSearchType(searchType);
    setCurrentPage(1);
  }

  const handleClearSearch = () => {
    setSearch('');
    setAppliedSearch('');
    setAppliedSearchType(searchType);
    setCurrentPage(1);
  }

  const handleChangeSearch = (event) => {
    const value = event.target.value;

    setSearch(searchType === 'cpf_or_cnpj' ? onlyNumbers(value) : value);
  };

  const handleChangeSearchType = (event) => {
    const nextSearchType = event.target.value;

    setSearchType(nextSearchType);
    setSearch(nextSearchType === 'cpf_or_cnpj' ? onlyNumbers(search) : search);
  };

  const handleBrokerSaved = React.useCallback(async () => {
    await loadBrokers();
  }, [loadBrokers]);

  const handleOpenCreateBroker = () => {
    setSelectedBroker(null);
    setIsBrokerFormOpen(true);
  }

  const handleOpenEditBroker = async (broker) => {
    setViewingBrokerId(broker.id);

    try {
      const response = await viewBroker(broker.id);
      setSelectedBroker(getBrokerFromResponse(response));
      setIsBrokerFormOpen(true);
    } catch (requestError) {
      toast.error(requestError.message || 'Erro ao carregar corretor.');
    } finally {
      setViewingBrokerId(null);
    }
  }

  const handleCloseBrokerForm = () => {
    setIsBrokerFormOpen(false);
    setSelectedBroker(null);
  };

  return (
    <>
      <MainCard
        title="Corretores"
        secondary={
          <Button type="button" variant="contained" startIcon={<IconPlus size={18} />} onClick={handleOpenCreateBroker}>
            Novo corretor
          </Button>
        }
      >
        <Stack spacing={2}>
          <Stack component="form" direction={{ xs: 'column', sm: 'row'}} spacing={1.5} onSubmit={handleSearch}>
            <TextField
              select
              label="Buscar por"
              value={searchType}
              onChange={handleChangeSearchType}
              size="small"
              sx={{ minWidth: {sx: '100%', sm: 160 }}}
              >
                <MenuItem value="name">Nome</MenuItem>
                <MenuItem value="cpf_or_cnpj">CPF/CNPJ</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label={searchType === 'cpf_or_cnpj' ? 'Digite o CPF ou CNPJ' : 'Digite o nome do(a) corretor(a)'}
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
                    <TableCell align="center">Nome</TableCell>
                    <TableCell align="center">CPF/CNPJ</TableCell>
                    <TableCell align="center">Telefone</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Data de nascimento</TableCell>
                    <TableCell align="center">Data de cadastro</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isInitialLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  )}

                  {!isInitialLoading &&
                    brokers.map((broker, index) => (
                      <TableRow hover key={broker.id || broker.uuid || index}>
                        <TableCell align="center">{broker.name}</TableCell>
                        <TableCell align="center">{ formatCPFOrCNPJToView(broker.cpf_or_cnpj) }</TableCell>
                        <TableCell align="center">{ formatCellphoneToView(broker.cellphone) }</TableCell>
                        <TableCell align="center">{broker.email}</TableCell>
                        <TableCell align="center">{ formatDate(broker.birthdate) }</TableCell>
                        <TableCell align="center">{ formatDate(broker.created_at) }</TableCell>
                        <TableCell align="center">
                            <Button type="button" variant="outlined" size="small" onClick={() => handleOpenEditBroker(broker)} disabled={viewingBrokerId === broker.id}>
                              {viewingBrokerId === broker.id ? 'Carregando...' : 'Ver/Editar'}
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                Página {currentPage} de {lastPage} - {total} corretor{total === 1 ? '' : 'es'}
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
      <BrokerFormDialog open={isBrokerFormOpen} broker={selectedBroker} onClose={handleCloseBrokerForm} onSaved={handleBrokerSaved} />
    </>
  );
}
