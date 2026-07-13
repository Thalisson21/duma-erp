import PropTypes from 'prop-types';
import * as React from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconEdit, IconDeviceFloppy, IconX } from '@tabler/icons-react';

import { getAddressByCep } from 'api/cep';
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
  const [resolvedBroker, setResolvedBroker] = React.useState(null);
  const [isCheckingDocument, setIsCheckingDocument] = React.useState(false);

  const lastCepRef = React.useRef('');
  const lastCheckedDocRef = React.useRef('');
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
      setIsEditing(false);
      setActiveTab(0);
      setResolvedBroker(null);
      lastCepRef.current = '';
      lastCheckedDocRef.current = '';
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

  const updateField = (field, value) => {
    if (isReadOnly) return;
    setForm((cur) => ({ ...cur, [field]: value }));
    setErrors((cur) => ({ ...cur, [field]: undefined }));
  };

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
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="md">
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
                  <Chip size="small" color={effectiveBroker?.is_active ? 'success' : 'default'} label={effectiveBroker?.is_active ? 'Ativo' : 'Inativo'} />
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
                  helperText={errors.cpf_or_cnpj || (isCheckingDocument ? 'Verificando cadastro...' : '')}
                  InputProps={{ endAdornment: isCheckingDocument ? <CircularProgress size={16} /> : null }}
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
                <BrokerTextField label="Estado civil" value={form.marital_status} onChange={(e) => updateField('marital_status', e.target.value)} isReadOnly={isReadOnly} />
                <BrokerTextField label="Gênero" value={form.genre} onChange={(e) => updateField('genre', e.target.value)} error={Boolean(errors.genre)} helperText={errors.genre} isReadOnly={isReadOnly} required />
              </ProfileCard>

              <ProfileCard title="Dados bancários">
                <BrokerTextField label="Banco" value={form.bank_name} onChange={(e) => updateField('bank_name', e.target.value)} error={Boolean(errors.bank_name)} helperText={errors.bank_name} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Agência" value={form.agency_number} onChange={(e) => updateField('agency_number', e.target.value)} error={Boolean(errors.agency_number)} helperText={errors.agency_number} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Conta" value={form.bank_account} onChange={(e) => updateField('bank_account', e.target.value)} error={Boolean(errors.bank_account)} helperText={errors.bank_account} isReadOnly={isReadOnly} required />
                <BrokerTextField label="Tipo de conta" value={form.type_account} onChange={(e) => updateField('type_account', e.target.value)} error={Boolean(errors.type_account)} helperText={errors.type_account} isReadOnly={isReadOnly} required />
                {isViewing && <BrokerTextField label="Saldo" value={form.balance} isReadOnly={true} />}
              </ProfileCard>

              <ProfileCard title="Sistema">
                {isViewing && <BrokerTextField label="Tenant ID" value={effectiveBroker?.tenant_id} isReadOnly={true} />}
                {isViewing && <BrokerTextField label="Criado em" value={form.created_at} isReadOnly={true} />}
                {isViewing && <BrokerTextField label="Atualizado em" value={form.updated_at} isReadOnly={true} />}
                {isViewing && avatar?.filename && (
                  <BrokerTextField label="Arquivo do avatar" value={avatar.filename} isReadOnly={true} />
                )}
              </ProfileCard>
            </Stack>
          )}

          {/* Aba 1 — Financeiro (placeholder) */}
          {isViewing && activeTab === 1 && (
            <Stack spacing={2} sx={{ p: 3 }}>
              <ProfileCard title="Resumo Financeiro">
                {(() => {
                  const balanceValue = Number(effectiveBroker?.balance ?? 0);
                  const isNegative = balanceValue < 0;
                  return (
                    <Box sx={{ p: 2, borderRadius: 1, bgcolor: isNegative ? 'error.light' : 'success.light', textAlign: 'center', opacity: 0.85 }}>
                      <Typography variant="h5" color={isNegative ? 'error.dark' : 'success.dark'} fontWeight={700}>
                        {form.balance || 'R$ 0,00'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Saldo atual</Typography>
                    </Box>
                  );
                })()}
                <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'primary.light', textAlign: 'center', opacity: 0.85 }}>
                  <Typography variant="h5" color="primary.dark" fontWeight={700}>—</Typography>
                  <Typography variant="caption" color="text.secondary">Comissões</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'warning.light', textAlign: 'center', opacity: 0.85 }}>
                  <Typography variant="h5" color="warning.dark" fontWeight={700}>—</Typography>
                  <Typography variant="caption" color="text.secondary">Pagamentos</Typography>
                </Box>
              </ProfileCard>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>Transações Recentes</Typography>
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography color="text.secondary">Nenhuma transação encontrada.</Typography>
                    <Typography variant="caption" color="text.disabled">Esta funcionalidade estará disponível em breve.</Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>Pagamentos</Typography>
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography color="text.secondary">Nenhum pagamento encontrado.</Typography>
                    <Typography variant="caption" color="text.disabled">Esta funcionalidade estará disponível em breve.</Typography>
                  </Box>
                </CardContent>
              </Card>
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
