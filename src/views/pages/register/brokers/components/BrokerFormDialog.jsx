import PropTypes from 'prop-types';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  IconEdit,
  IconDeviceFloppy,
  IconEye,
  IconPrinter,
  IconTrendingDown,
  IconTrendingUp,
  IconX
} from '@tabler/icons-react';

import { getBanks } from 'api/banks';
import { getAddressByCep } from 'api/cep';
import { getCompanyByCnpj } from 'api/cnpj';
import { getAdvanceReports } from 'api/financial/advanceReports';
import { getReports } from 'api/financial/reports';
import { getTransactions } from 'api/financial/transactions';
import { createBroker, getBrokerAvatar, getBrokerTypes, getBrokers, updateBroker, viewBroker } from 'api/register/brokers';
import UserAvatar from 'assets/images/users/guest.svg';
import { useToast } from 'services/toastService';
import {
  formatCPFOrCNPJ,
  formatCPFOrCNPJToView,
  formatCellphone,
  formatCellphoneToView,
  formatDate,
  formatZipCode,
  onlyNumbers
} from 'utils/masks';
import BrokerReceiptModal from './BrokerReceiptModal';

const initialForm = {
  cpf_or_cnpj: '',
  name: '',
  email: '',
  street: '',
  district: '',
  city: '',
  state: '',
  country: '',
  marital_status: '',
  genre: '',
  cellphone: '',
  birthdate: '',
  broker_type_id: '',
  broker_type: '',
  number: '',
  complement: '',
  cep: '',
  personType: '',
  bank_name: '',
  agency_number: '',
  bank_account: '',
  type_account: ''
};

function ProfileCard({ title, children }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}

ProfileCard.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node };

function extractBroker(response) {
  const b = response?.broker || response?.data?.broker || response?.data || response;
  return Array.isArray(b) ? b[0] || null : b;
}

function getDateInputValue(value) {
  if (!value) return '';
  return String(value).split('T')[0];
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

function formatBoolean(value) {
  if (value === null || value === undefined) return '';
  return value ? 'Sim' : 'Não';
}

function getAvatarRecord(broker) {
  return Array.isArray(broker?.broker_avatar) ? broker.broker_avatar[0] : broker?.broker_avatar;
}

function getInitialForm(broker) {
  if (!broker) return initialForm;

  const personTypeRaw = broker.person_type ?? broker.personType;
  const personType = personTypeRaw != null ? Boolean(Number(personTypeRaw)) : '';

  return {
    ...initialForm,
    cpf_or_cnpj: formatCPFOrCNPJToView(broker.cpf_or_cnpj),
    name: broker.name || '',
    email: broker.email || '',
    street: broker.street || '',
    district: broker.district || '',
    city: broker.city || '',
    state: broker.state || '',
    country: broker.country || '',
    marital_status: broker.marital_status || '',
    genre: broker.genre || '',
    cellphone: formatCellphoneToView(broker.cellphone),
    birthdate: getDateInputValue(broker.birthdate),
    broker_type_id: broker.broker_type_id || '',
    broker_type: broker.broker_type?.description || broker.broker_type || '',
    number: broker.number || '',
    complement: broker.complement || '',
    cep: formatZipCode(broker.cep),
    personType,
    bank_name: broker.bank_name || '',
    agency_number: broker.agency_number || '',
    bank_account: broker.bank_account || '',
    type_account: broker.type_account || '',
    balance: formatCurrency(broker.balance),
    is_active: formatBoolean(broker.is_active),
    created_at: formatDate(broker.created_at),
    updated_at: formatDate(broker.updated_at)
  };
}

function validateForm(form) {
  const errors = {};
  const documentLength = onlyNumbers(form.cpf_or_cnpj).length;
  const cepLength = onlyNumbers(form.cep).length;
  const cellphoneLength = onlyNumbers(form.cellphone).length;

  if (![11, 14].includes(documentLength)) errors.cpf_or_cnpj = 'Informe um CPF ou CNPJ válido.';
  if (!form.name.trim()) errors.name = 'Informe o nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Informe um e-mail válido.';
  if (!form.street.trim()) errors.street = 'Informe a rua.';
  if (!form.district.trim()) errors.district = 'Informe o bairro.';
  if (!form.city.trim()) errors.city = 'Informe a cidade.';
  if (!form.state.trim()) errors.state = 'Informe o estado.';
  if (!form.genre.trim()) errors.genre = 'Informe o gênero.';
  if (cellphoneLength < 10) errors.cellphone = 'Informe um telefone válido.';
  if (!form.broker_type_id) errors.broker_type_id = 'Informe o tipo de corretor.';
  if (cepLength !== 8) errors.cep = 'Informe um CEP com 8 dígitos.';
  if (!form.bank_name.trim()) errors.bank_name = 'Informe o banco.';
  if (!form.agency_number.trim()) errors.agency_number = 'Informe a agência.';
  if (!form.bank_account.trim()) errors.bank_account = 'Informe a conta.';
  if (!form.type_account.trim()) errors.type_account = 'Informe o tipo de conta.';

  return errors;
}

function toPayload(form) {
  return {
    cpf_or_cnpj: onlyNumbers(form.cpf_or_cnpj),
    name: form.name,
    email: form.email,
    street: form.street,
    district: form.district,
    city: form.city,
    state: form.state,
    country: form.country,
    marital_status: form.marital_status,
    genre: form.genre,
    cellphone: onlyNumbers(form.cellphone),
    birthdate: form.birthdate,
    broker_type_id: form.broker_type_id,
    number: form.number,
    complement: form.complement,
    cep: onlyNumbers(form.cep),
    person_type: form.personType === '' ? null : form.personType,
    bank_name: form.bank_name,
    agency_number: form.agency_number,
    bank_account: form.bank_account,
    type_account: form.type_account,
    branch_id: null
  };
}

function StatusChip({ status }) {
  if (status === 'Pago') {
    return <span className="status-pill">Pago</span>;
  }

  if (status === 'Cancelado') {
    return <span className="status-pill status-pill--negative">Cancelado</span>;
  }

  return <Chip size="small" label={status || '-'} />;
}

StatusChip.propTypes = { status: PropTypes.string };

function getPaymentStatusLabel(row) {
  if (row.is_paid === true) return 'Pago';
  if (row.is_paid === false && row.is_canceled === false) return 'Pendente';
  if (row.is_canceled === true) return 'Cancelado';
  return '-';
}

// O objeto do recibo vindo da API nem sempre traz o CPF/CNPJ (e outros dados) do corretor —
// completamos com os dados já carregados na tela do corretor.
function withBrokerFallback(report, brokerFallback) {
  if (!brokerFallback) return report;

  return {
    ...report,
    broker: {
      name: report?.broker?.name || brokerFallback.name,
      cpf_or_cnpj: report?.broker?.cpf_or_cnpj || brokerFallback.cpf_or_cnpj,
      balance: report?.broker?.balance ?? brokerFallback.balance,
      broker_type: report?.broker?.broker_type || brokerFallback.broker_type
    }
  };
}

function ReceiptActionButton({ report, isAdvance, brokerFallback }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const report_ = withBrokerFallback(report, brokerFallback);

  return (
    <>
      <Tooltip title={isAdvance ? 'Visualizar / imprimir adiantamento' : 'Visualizar / imprimir recibo'}>
        <IconButton
          size="small"
          onClick={() => setIsOpen(true)}
          sx={{
            bgcolor: 'action.hover',
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.selected', color: 'text.primary' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <IconEye size={16} />
            <IconPrinter size={16} />
          </Box>
        </IconButton>
      </Tooltip>

      <BrokerReceiptModal open={isOpen} onClose={() => setIsOpen(false)} report={report_} isAdvance={isAdvance} />
    </>
  );
}

ReceiptActionButton.propTypes = {
  report: PropTypes.object.isRequired,
  isAdvance: PropTypes.bool,
  brokerFallback: PropTypes.object
};

function getPaymentColumns(brokerFallback) {
  return [
    { key: 'receipt', label: 'Recibo', render: (row) => row.receipt || row.id || '-' },
    { key: 'gross', label: 'Valor Bruto', align: 'right', render: (row) => formatCurrency(row.gross_value) || '-' },
    { key: 'net', label: 'Líquido', align: 'right', render: (row) => formatCurrency(row.net_value) || '-' },
    { key: 'status', label: 'Status', align: 'center', render: (row) => <StatusChip status={getPaymentStatusLabel(row)} /> },
    { key: 'date', label: 'Data', align: 'right', render: (row) => formatDate(row.date || row.created_at) || '-' },
    {
      key: 'actions',
      label: 'Ações',
      align: 'center',
      render: (row) => <ReceiptActionButton report={row} isAdvance={false} brokerFallback={brokerFallback} />
    }
  ];
}

function getAdvanceColumns(brokerFallback) {
  return [
    { key: 'receipt', label: 'Recibo', render: (row) => row.id || '-' },
    { key: 'value', label: 'Valor', align: 'right', render: (row) => formatCurrency(row.amount_to_pay) || '-' },
    { key: 'status', label: 'Status', align: 'center', render: (row) => <StatusChip status={getPaymentStatusLabel(row)} /> },
    { key: 'installments', label: 'Parcelas', align: 'center', render: (row) => row.receipts?.length ?? '-' },
    { key: 'date', label: 'Data', align: 'right', render: (row) => formatDate(row.date || row.created_at) || '-' },
    {
      key: 'actions',
      label: 'Ações',
      align: 'center',
      render: (row) => <ReceiptActionButton report={row} isAdvance brokerFallback={brokerFallback} />
    }
  ];
}

const EMPTY_PARAMS = {};
const PAID_REPORTS_PARAMS = { isPaid: true };

function getTransactionTypeLabel(type) {
  const normalized = String(type || '').toUpperCase();

  if (normalized === 'INCOMING') return 'Entrada';
  if (normalized === 'OUTCOMING') return 'Saída';

  return type || '-';
}

function TransactionTypeChip({ type }) {
  const label = getTransactionTypeLabel(type);

  if (label === 'Entrada') {
    return <span className="status-pill">Entrada</span>;
  }

  if (label === 'Saída') {
    return <span className="status-pill status-pill--negative">Saída</span>;
  }

  return <Chip size="small" label={label} />;
}

TransactionTypeChip.propTypes = { type: PropTypes.string };

function CurrencyValue({ value }) {
  const numeric = Number(value);
  const formatted = formatCurrency(value);

  if (!formatted || Number.isNaN(numeric)) {
    return <Typography variant="body2">-</Typography>;
  }

  const color = numeric > 0 ? 'success.main' : numeric < 0 ? 'error.main' : 'text.primary';

  return (
    <Typography variant="body2" color={color} fontWeight={600}>
      {formatted}
    </Typography>
  );
}

CurrencyValue.propTypes = { value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };

const TRANSACTION_COLUMNS = [
  { key: 'description', label: 'Descrição', render: (row) => row.description || '-' },
  { key: 'type', label: 'Tipo', align: 'center', render: (row) => <TransactionTypeChip type={row.transaction_type || row.type} /> },
  { key: 'value', label: 'Valor', align: 'right', render: (row) => <CurrencyValue value={row.value} /> },
  { key: 'balance', label: 'Saldo Atual', align: 'right', render: (row) => <CurrencyValue value={row.current_balance ?? row.balance} /> },
  { key: 'date', label: 'Data', align: 'right', render: (row) => formatDate(row.date || row.created_at) || '-' }
];

function FinancialRecordsCard({ title, brokerId, fetcher, columns, emptyLabel, extraParams = EMPTY_PARAMS }) {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!brokerId) return undefined;

    let isActive = true;
    setIsLoading(true);
    setError('');

    fetcher({ brokerId, page, perPage: 5, ...extraParams })
      .then((response) => {
        if (!isActive) return;
        const data = response?.data || (Array.isArray(response) ? response : []);
        const meta = response?.meta || {};
        setRows(data);
        setLastPage(meta.last_page ?? 1);
        setTotal(meta.total ?? data.length);
      })
      .catch((requestError) => {
        if (!isActive) return;
        setError(requestError.message || 'Não foi possível carregar os dados.');
      })
      .finally(() => { if (isActive) setIsLoading(false); });

    return () => { isActive = false; };
  }, [brokerId, fetcher, page, extraParams]);

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {isLoading ? 'Carregando...' : `${total} registro${total === 1 ? '' : 's'}`}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ px: 2.5, py: 2 }}>
            {error}
          </Typography>
        )}

        {!error && (
          <TableContainer sx={{ maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align || 'left'}
                      sx={{ fontWeight: 600, whiteSpace: 'nowrap', bgcolor: 'grey.50' }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 5, border: 0 }}>
                      <CircularProgress size={22} />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 5, border: 0 }}>
                      <Typography variant="body2" color="text.secondary">{emptyLabel}</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  rows.map((row, index) => (
                    <TableRow
                      key={row.id ?? index}
                      hover
                      sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:last-child td': { border: 0 } }}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} align={col.align || 'left'} sx={{ whiteSpace: 'nowrap' }}>
                          {col.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {lastPage > 1 && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 1.25, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">Página {page} de {lastPage}</Typography>
          <Pagination size="small" count={lastPage} page={page} onChange={(_, value) => setPage(value)} disabled={isLoading} />
        </Stack>
      )}
    </Card>
  );
}

FinancialRecordsCard.propTypes = {
  title: PropTypes.string.isRequired,
  brokerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetcher: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  emptyLabel: PropTypes.string.isRequired,
  extraParams: PropTypes.object
};

function BrokerTextField({ isReadOnly, onChange, value, ...props }) {
  return <TextField value={value ?? ''} onChange={onChange} disabled={isReadOnly} fullWidth size="small" {...props} />;
}

BrokerTextField.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default function BrokerFormDialog({ broker, onClose, onSaved, open }) {
  const toast = useToast();
  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [submitError, setSubmitError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isCepLoading, setIsCepLoading] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(UserAvatar);
  const [isAvatarLoading, setIsAvatarLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [brokerTypes, setBrokerTypes] = React.useState([]);
  const [bankOptions, setBankOptions] = React.useState([]);
  const [resolvedBroker, setResolvedBroker] = React.useState(null);
  const [isCheckingDocument, setIsCheckingDocument] = React.useState(false);
  const [isCnpjLoading, setIsCnpjLoading] = React.useState(false);

  const lastCepRef = React.useRef('');
  const lastCheckedDocRef = React.useRef('');
  const lastCnpjRef = React.useRef('');
  const avatarObjectUrlRef = React.useRef(null);
  const isReadOnlyRef = React.useRef(true);
  const toastRef = React.useRef(toast);

  const effectiveBroker = resolvedBroker || broker;
  const isViewing = Boolean(effectiveBroker?.id);
  const isReadOnly = isViewing && !isEditing;
  const avatar = getAvatarRecord(effectiveBroker);

  isReadOnlyRef.current = isReadOnly;
  toastRef.current = toast;

  const brokerTypeLabel =
    brokerTypes.find((t) => String(t.id) === String(form.broker_type_id))?.description ||
    form.broker_type ||
    'Tipo não informado';

  const receiptBrokerFallback = React.useMemo(
    () => ({
      name: form.name,
      cpf_or_cnpj: form.cpf_or_cnpj,
      balance: effectiveBroker?.balance,
      broker_type: { description: brokerTypeLabel !== 'Tipo não informado' ? brokerTypeLabel : undefined }
    }),
    [form.name, form.cpf_or_cnpj, effectiveBroker?.balance, brokerTypeLabel]
  );

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    };
  }, []);

  // Load/reset form when dialog opens/closes or effective broker changes
  React.useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setErrors({});
      setSubmitError('');
      setAvatarSrc(UserAvatar);
      setIsCepLoading(false);
      setIsCheckingDocument(false);
      setIsCnpjLoading(false);
      setIsEditing(false);
      setActiveTab(0);
      setResolvedBroker(null);
      lastCepRef.current = '';
      lastCheckedDocRef.current = '';
      lastCnpjRef.current = '';
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
      return;
    }

    const nextForm = getInitialForm(effectiveBroker);
    setForm(nextForm);
    setErrors({});
    setSubmitError('');
    lastCepRef.current = onlyNumbers(nextForm.cep);

    const avatarList = effectiveBroker?.broker_avatar;
    const isEmpty = Array.isArray(avatarList) ? avatarList.length === 0 : !avatarList?.id;
    const avatarId = Array.isArray(avatarList) ? avatarList[0]?.id : avatarList?.id;

    if (isEmpty || !avatarId) {
      setAvatarSrc(UserAvatar);
      return;
    }

    let isActive = true;
    setIsAvatarLoading(true);

    getBrokerAvatar(avatarId)
      .then((blob) => {
        if (!isActive) return;
        if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
        const objectUrl = URL.createObjectURL(blob);
        avatarObjectUrlRef.current = objectUrl;
        setAvatarSrc(objectUrl);
      })
      .catch(() => { if (isActive) setAvatarSrc(UserAvatar); })
      .finally(() => { if (isActive) setIsAvatarLoading(false); });

    return () => { isActive = false; };
  }, [effectiveBroker, open]);

  // Fetch broker types when dialog opens
  React.useEffect(() => {
    if (!open) return;

    getBrokerTypes()
      .then((response) => {
        const types = response?.broker_types || response?.data || (Array.isArray(response) ? response : []);
        setBrokerTypes(types);
      })
      .catch(() => {});
  }, [open]);

  // Fetch bank options (BrasilAPI) when dialog opens
  React.useEffect(() => {
    if (!open) return;

    getBanks()
      .then((banks) => {
        const names = banks.map((bank) => bank.fullName || bank.name).filter(Boolean);
        setBankOptions([...new Set(names)]);
      })
      .catch(() => {});
  }, [open]);

  // CEP auto-fill (only in create/edit mode)
  React.useEffect(() => {
    if (isReadOnlyRef.current) return undefined;

    const cleanCep = onlyNumbers(form.cep);
    if (cleanCep.length !== 8 || cleanCep === lastCepRef.current) return undefined;

    let isActive = true;
    lastCepRef.current = cleanCep;
    setIsCepLoading(true);

    getAddressByCep(cleanCep)
      .then((address) => {
        if (!isActive || !address) return;
        setForm((cur) => ({ ...cur, ...address }));
        setErrors((cur) => ({ ...cur, cep: undefined }));
      })
      .catch((error) => {
        if (!isActive) return;
        setErrors((cur) => ({ ...cur, cep: error.message }));
        toastRef.current.warning(error.message || 'Não foi possível buscar o CEP.');
      })
      .finally(() => { setIsCepLoading(false); });

    return () => { isActive = false; };
  }, [form.cep]);

  // CPF/CNPJ duplicate check (only when creating)
  React.useEffect(() => {
    if (isViewing) return;

    const cleanDoc = onlyNumbers(form.cpf_or_cnpj);
    if (![11, 14].includes(cleanDoc.length)) return;
    if (cleanDoc === lastCheckedDocRef.current) return;

    lastCheckedDocRef.current = cleanDoc;
    let isActive = true;
    setIsCheckingDocument(true);

    getBrokers({ search: cleanDoc, searchType: 'cpf_or_cnpj', perPage: 1 })
      .then(async (response) => {
        const found = response?.brokers?.data?.[0];
        if (!found || !isActive) return;

        const full = await viewBroker(found.id);
        if (!isActive) return;

        const brokerData = extractBroker(full);
        if (brokerData) {
          setResolvedBroker(brokerData);
          setIsEditing(true);
          toastRef.current.warning('Corretor já cadastrado. Perfil carregado para edição.');
        }
      })
      .catch(() => {})
      .finally(() => { if (isActive) setIsCheckingDocument(false); });

    return () => { isActive = false; };
  }, [form.cpf_or_cnpj, isViewing]);

  // CNPJ auto-fill via BrasilAPI (only in create/edit mode)
  React.useEffect(() => {
    if (isReadOnlyRef.current) return undefined;

    const cleanDoc = onlyNumbers(form.cpf_or_cnpj);
    if (cleanDoc.length !== 14 || cleanDoc === lastCnpjRef.current) return undefined;

    let isActive = true;
    lastCnpjRef.current = cleanDoc;
    setIsCnpjLoading(true);

    getCompanyByCnpj(cleanDoc)
      .then((company) => {
        if (!isActive || !company) return;

        if (company.cep) lastCepRef.current = onlyNumbers(company.cep);

        setForm((cur) => ({
          ...cur,
          name: company.name || cur.name,
          email: company.email || cur.email,
          cellphone: company.cellphone ? formatCellphone(company.cellphone) : cur.cellphone,
          street: company.street || cur.street,
          number: company.number || cur.number,
          complement: company.complement || cur.complement,
          district: company.district || cur.district,
          city: company.city || cur.city,
          state: company.state || cur.state,
          cep: company.cep ? formatZipCode(company.cep) : cur.cep,
          country: company.country || cur.country
        }));
        setErrors((cur) => ({ ...cur, cep: undefined }));
      })
      .catch((error) => {
        if (!isActive) return;
        toastRef.current.warning(error.message || 'Não foi possível buscar os dados do CNPJ.');
      })
      .finally(() => { if (isActive) setIsCnpjLoading(false); });

    return () => { isActive = false; };
  }, [form.cpf_or_cnpj]);

  const updateField = (field, value) => {
    if (isReadOnly) return;
    setForm((cur) => ({ ...cur, [field]: value }));
    setErrors((cur) => ({ ...cur, [field]: undefined }));
  };

  // Detecta CPF (11 dígitos) ou CNPJ (14 dígitos) e ajusta o tipo de pessoa automaticamente
  React.useEffect(() => {
    if (isReadOnlyRef.current) return;

    const docLength = onlyNumbers(form.cpf_or_cnpj).length;
    if (docLength === 11 && form.personType !== false) {
      setForm((cur) => ({ ...cur, personType: false }));
    } else if (docLength === 14 && form.personType !== true) {
      setForm((cur) => ({ ...cur, personType: true }));
    }
  }, [form.cpf_or_cnpj]);

  // Pessoa jurídica (CNPJ) não possui estado civil — força "Outros"
  React.useEffect(() => {
    if (form.personType === true && form.marital_status !== 'Outros') {
      setForm((cur) => ({ ...cur, marital_status: 'Outros' }));
    }
  }, [form.personType]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setErrors({});
    setSubmitError('');
  };

  const handleCancelEdit = () => {
    setForm(getInitialForm(effectiveBroker));
    setErrors({});
    setSubmitError('');
    setIsEditing(false);
    lastCepRef.current = onlyNumbers(String(effectiveBroker?.cep || ''));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isReadOnly) return;

    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      if (isViewing) {
        await updateBroker(effectiveBroker.id, toPayload(form));
        toast.success('Corretor atualizado com sucesso.');
        setIsEditing(false);
      } else {
        await createBroker(toPayload(form));
        toast.success('Corretor cadastrado com sucesso.');
        onClose();
      }
      await onSaved();
    } catch (error) {
      setSubmitError(error.message || 'Não foi possível salvar o corretor.');
      toast.error(error.message || 'Não foi possível salvar o corretor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth={isViewing && activeTab === 1 ? 'xl' : 'md'}>
      <DialogTitle sx={{ pb: 0 }}>
        {isViewing ? (form.name || 'Corretor') : 'Novo corretor'}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Stack component="form" id="broker-form" onSubmit={handleSubmit}>

          {/* Header de perfil — persistente entre abas */}
          {isViewing && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ px: 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}
            >
              {isAvatarLoading ? (
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CircularProgress size={36} thickness={4} />
                </Box>
              ) : (
                <Avatar
                  src={avatarSrc}
                  alt={form.name || 'Corretor'}
                  onError={() => { if (avatarSrc !== UserAvatar) setAvatarSrc(UserAvatar); }}
                  sx={{ width: 80, height: 80, bgcolor: 'grey.100', flexShrink: 0 }}
                />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h4">{form.name || 'Corretor'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {form.email || 'E-mail não informado'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
                  {brokerTypeLabel !== 'Tipo não informado' && <Chip size="small" label={brokerTypeLabel} />}
                  {effectiveBroker?.is_active ? (
                    <span className="status-pill">Ativo</span>
                  ) : (
                    <Chip size="small" label="Inativo" />
                  )}
                </Stack>
              </Box>
            </Stack>
          )}

          {/* Abas — apenas na visualização */}
          {isViewing && (
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Dados Cadastrais" />
              <Tab label="Financeiro" />
            </Tabs>
          )}

          {submitError && (
            <Box sx={{ px: 3, pt: 2 }}>
              <Typography color="error" variant="body2">{submitError}</Typography>
            </Box>
          )}

          {/* Aba 0 — Dados Cadastrais / formulário de cadastro */}
          {(!isViewing || activeTab === 0) && (
            <Stack spacing={2} sx={{ p: 3 }}>
              <ProfileCard title="Identificação">
                {isViewing && <BrokerTextField label="ID" value={effectiveBroker?.id} isReadOnly={true} />}

                <BrokerTextField
                  label="CPF/CNPJ"
                  value={form.cpf_or_cnpj}
                  onChange={(e) => updateField('cpf_or_cnpj', formatCPFOrCNPJ(e.target.value))}
                  error={Boolean(errors.cpf_or_cnpj)}
                  helperText={
                    errors.cpf_or_cnpj ||
                    (isCheckingDocument ? 'Verificando cadastro...' : '') ||
                    (isCnpjLoading ? 'Buscando dados do CNPJ...' : '')
                  }
                  InputProps={{ endAdornment: isCheckingDocument || isCnpjLoading ? <CircularProgress size={16} /> : null }}
                  isReadOnly={isReadOnly}
                  required
                />

                <BrokerTextField
                  label="Nome"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  isReadOnly={isReadOnly}
                  required
                />

                {/* Tipo de pessoa — Select */}
                <TextField
                  select
                  label="Tipo de pessoa"
                  value={form.personType === '' ? '' : String(form.personType)}
                  onChange={(e) => {
                    const v = e.target.value;
                    updateField('personType', v === '' ? '' : v === 'true');
                  }}
                  disabled={isReadOnly}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="false">Física</MenuItem>
                  <MenuItem value="true">Jurídica</MenuItem>
                </TextField>

                {/* Tipo de corretor — Select com dados da API */}
                <TextField
                  select
                  label="Tipo de corretor"
                  value={form.broker_type_id}
                  onChange={(e) => updateField('broker_type_id', e.target.value)}
                  disabled={isReadOnly}
                  fullWidth
                  size="small"
                  required
                  error={Boolean(errors.broker_type_id)}
                  helperText={errors.broker_type_id}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {brokerTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.description}
                    </MenuItem>
                  ))}
                </TextField>

                {isViewing && <BrokerTextField label="Ativo" value={form.is_active} isReadOnly={true} />}
              </ProfileCard>

              <ProfileCard title="Endereço">
                <BrokerTextField
                  label="CEP"
                  value={form.cep}
                  onChange={(e) => updateField('cep', formatZipCode(e.target.value))}
                  error={Boolean(errors.cep)}
                  helperText={errors.cep || (isCepLoading ? 'Buscando endereço...' : '')}
                  InputProps={{ endAdornment: isCepLoading ? <CircularProgress size={16} /> : null }}
                  isReadOnly={isReadOnly}
                  required
                />
                <BrokerTextField label="Rua" value={form.street} onChange={(e) => updateField('street', e.target.value)} error={Boolean(errors.street)} helperText={errors.street} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Número" value={form.number} onChange={(e) => updateField('number', e.target.value)} isReadOnly={isReadOnly} />
                <BrokerTextField label="Bairro" value={form.district} onChange={(e) => updateField('district', e.target.value)} error={Boolean(errors.district)} helperText={errors.district} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Cidade" value={form.city} onChange={(e) => updateField('city', e.target.value)} error={Boolean(errors.city)} helperText={errors.city} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Estado" value={form.state} onChange={(e) => updateField('state', e.target.value)} error={Boolean(errors.state)} helperText={errors.state} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Complemento" value={form.complement} onChange={(e) => updateField('complement', e.target.value)} isReadOnly={isReadOnly} />
                <BrokerTextField label="País" value={form.country} onChange={(e) => updateField('country', e.target.value.toUpperCase().slice(0, 2))} isReadOnly={isReadOnly} />
              </ProfileCard>

              <ProfileCard title="Contato e dados pessoais">
                <BrokerTextField label="E-mail" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} error={Boolean(errors.email)} helperText={errors.email} isReadOnly={isReadOnly} required />
                <BrokerTextField
                  label="Celular"
                  value={form.cellphone}
                  onChange={(e) => updateField('cellphone', formatCellphone(e.target.value))}
                  error={Boolean(errors.cellphone)}
                  helperText={errors.cellphone}
                  isReadOnly={isReadOnly}
                  required
                />
                <BrokerTextField label="Data de nascimento" type="date" value={form.birthdate} onChange={(e) => updateField('birthdate', e.target.value)} InputLabelProps={{ shrink: true }} isReadOnly={isReadOnly} />

                <TextField
                  select
                  label="Estado civil"
                  value={form.marital_status}
                  onChange={(e) => updateField('marital_status', e.target.value)}
                  disabled={isReadOnly || form.personType === true}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                  <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                  <MenuItem value="União Estável">União Estável</MenuItem>
                  <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                  <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
                  <MenuItem value="Outros">Outros</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Gênero"
                  value={form.genre}
                  onChange={(e) => updateField('genre', e.target.value)}
                  disabled={isReadOnly}
                  fullWidth
                  size="small"
                  required
                  error={Boolean(errors.genre)}
                  helperText={errors.genre}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Outros">Outros</MenuItem>
                  <MenuItem value="Prefiro não informar">Prefiro não informar</MenuItem>
                </TextField>
              </ProfileCard>

              <ProfileCard title="Dados bancários">
                <Autocomplete
                  freeSolo
                  fullWidth
                  size="small"
                  options={bankOptions}
                  value={form.bank_name}
                  onInputChange={(_, newValue) => updateField('bank_name', newValue)}
                  disabled={isReadOnly}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Banco"
                      error={Boolean(errors.bank_name)}
                      helperText={errors.bank_name}
                      required
                    />
                  )}
                />
                <BrokerTextField label="Agência" value={form.agency_number} onChange={(e) => updateField('agency_number', e.target.value)} error={Boolean(errors.agency_number)} helperText={errors.agency_number} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Conta" value={form.bank_account} onChange={(e) => updateField('bank_account', e.target.value)} error={Boolean(errors.bank_account)} helperText={errors.bank_account} isReadOnly={isReadOnly} required />
                <TextField
                  select
                  label="Tipo de conta"
                  value={form.type_account}
                  onChange={(e) => updateField('type_account', e.target.value)}
                  disabled={isReadOnly}
                  fullWidth
                  size="small"
                  required
                  error={Boolean(errors.type_account)}
                  helperText={errors.type_account}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="Poupança">Poupança</MenuItem>
                  <MenuItem value="Corrente">Corrente</MenuItem>
                </TextField>
                {isViewing && <BrokerTextField label="Saldo" value={form.balance} isReadOnly={true} />}
              </ProfileCard>

            </Stack>
          )}

          {/* Aba 1 — Financeiro (placeholder) */}
          {isViewing && activeTab === 1 && (
            <Stack spacing={2} sx={{ p: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>Resumo Financeiro</Typography>
                  {(() => {
                    const balanceValue = Number(effectiveBroker?.balance ?? 0);
                    const isNegative = balanceValue < 0;
                    const statusColor = isNegative ? 'error' : 'success';
                    const TrendIcon = isNegative ? IconTrendingDown : IconTrendingUp;

                    return (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ p: 2, borderRadius: 1.5, border: 1, borderColor: 'divider', width: 'fit-content', maxWidth: '100%' }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: `${statusColor}.main`,
                            color: `${statusColor}.contrastText`,
                            flexShrink: 0
                          }}
                        >
                          <TrendIcon size={26} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Saldo atual
                          </Typography>
                          <Typography variant="h4" fontWeight={700} color={`${statusColor}.main`} sx={{ lineHeight: 1.2 }}>
                            {form.balance || 'R$ 0,00'}
                          </Typography>
                        </Box>
                      </Stack>
                    );
                  })()}
                </CardContent>
              </Card>

              <Stack spacing={2}>
                <FinancialRecordsCard
                  title="Pagamentos"
                  brokerId={effectiveBroker?.id}
                  fetcher={getReports}
                  columns={getPaymentColumns(receiptBrokerFallback)}
                  emptyLabel="Nenhum pagamento encontrado."
                  extraParams={PAID_REPORTS_PARAMS}
                />
                <FinancialRecordsCard
                  title="Adiantamentos"
                  brokerId={effectiveBroker?.id}
                  fetcher={getAdvanceReports}
                  columns={getAdvanceColumns(receiptBrokerFallback)}
                  emptyLabel="Nenhum adiantamento encontrado."
                />
                <FinancialRecordsCard
                  title="Transações"
                  brokerId={effectiveBroker?.id}
                  fetcher={getTransactions}
                  columns={TRANSACTION_COLUMNS}
                  emptyLabel="Nenhuma transação encontrada."
                />
              </Stack>
            </Stack>
          )}

        </Stack>
      </DialogContent>

      <DialogActions>
        {!isViewing && (
          <>
            <Button onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" form="broker-form" variant="contained" disabled={isSaving || isCheckingDocument} startIcon={isSaving ? <CircularProgress size={16} /> : null}>
              {isSaving ? 'Salvando...' : 'Salvar corretor'}
            </Button>
          </>
        )}
        {isViewing && !isEditing && (
          <>
            <Button onClick={onClose}>Fechar</Button>
            <Button variant="contained" startIcon={<IconEdit size={16} />} onClick={handleStartEdit}>Editar</Button>
          </>
        )}
        {isViewing && isEditing && (
          <>
            <Button startIcon={<IconX size={16} />} onClick={handleCancelEdit} disabled={isSaving}>Cancelar edição</Button>
            <Button type="submit" form="broker-form" variant="contained" disabled={isSaving} startIcon={isSaving ? <CircularProgress size={16} /> : <IconDeviceFloppy size={16} />}>
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

BrokerFormDialog.propTypes = {
  broker: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
