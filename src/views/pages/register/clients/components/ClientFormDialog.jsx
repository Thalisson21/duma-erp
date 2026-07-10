import PropTypes from 'prop-types';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { getAddressByCep } from 'api/cep';
import { createClient, updateClient } from 'api/clients';
import { useToast } from 'services/toastService';
import { formatCPFOrCNPJ, formatCellphone, formatZipCode, onlyNumbers } from 'utils/masks';

const initialForm = {
  personType: 'individual',
  cpf_or_cnpj: '',
  name: '',
  cep: '',
  street: '',
  district: '',
  city: '',
  state: '',
  number: '',
  complement: '',
  country: 'BR',
  email: '',
  birthdate: '',
  marital_status: '',
  genre: '',
  cellphone: ''
};

const personTypeOptions = [
  { value: 'individual', label: 'Pessoa física' },
  { value: 'company', label: 'Pessoa jurídica' }
];

const maritalStatusOptions = [
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'União estável', label: 'União estável' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'Outros', label: 'Outros' }
];

const genreOptions = [
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Outros', label: 'Outros' },
  { value: 'Prefiro não informar', label: 'Prefiro não informar' }
];

function FormSection({ title, children }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))'
          }
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

function validateForm(form) {
  const errors = {};
  const documentLength = onlyNumbers(form.cpf_or_cnpj).length;
  const cepLength = onlyNumbers(form.cep).length;
  const cellphoneLength = onlyNumbers(form.cellphone).length;

  if (!form.name.trim()) {
    errors.name = 'Informe o nome.';
  }

  if (![11, 14].includes(documentLength)) {
    errors.cpf_or_cnpj = 'Informe um CPF ou CNPJ válido.';
  }

  if (cepLength !== 8) {
    errors.cep = 'Informe um CEP com 8 dígitos.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!form.marital_status) {
    errors.marital_status = 'Selecione o estado civil.';
  }

  if (!form.genre) {
    errors.genre = 'Selecione o gênero.';
  }

  if (cellphoneLength < 10) {
    errors.cellphone = 'Informe um telefone válido.';
  }

  return errors;
}

function toPayload(form) {
  return {
    ...form,
    cpf_or_cnpj: onlyNumbers(form.cpf_or_cnpj),
    cep: onlyNumbers(form.cep),
    cellphone: onlyNumbers(form.cellphone)
  };
}

function getDateInputValue(value) {
  if (!value) {
    return '';
  }

  return String(value).split('T')[0];
}

function normalizeSelectValue(value, options) {
  if (!value) {
    return '';
  }

  const option = options.find((currentOption) => currentOption.value.toLowerCase() === String(value).toLowerCase());

  return option?.value || value;
}

function getInitialForm(client) {
  if (!client) {
    return initialForm;
  }

  return {
    ...initialForm,
    personType: client.personType || client.person_type || initialForm.personType,
    cpf_or_cnpj: formatCPFOrCNPJ(client.cpf_or_cnpj),
    name: client.name || '',
    cep: formatZipCode(client.cep),
    street: client.street || '',
    district: client.district || '',
    city: client.city || '',
    state: client.state || '',
    number: client.number || '',
    complement: client.complement || '',
    country: client.country || 'BR',
    email: client.email || '',
    birthdate: getDateInputValue(client.birthdate),
    marital_status: normalizeSelectValue(client.marital_status, maritalStatusOptions),
    genre: normalizeSelectValue(client.genre, genreOptions),
    cellphone: formatCellphone(client.cellphone)
  };
}

export default function ClientFormDialog({ open, client, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [submitError, setSubmitError] = React.useState('');
  const [isCepLoading, setIsCepLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const lastCepRef = React.useRef('');
  const isEditing = Boolean(client?.id);
  const isReadOnly = isEditing && !isEditMode;

  React.useEffect(() => {
    if (open) {
      const nextForm = getInitialForm(client);

      setForm(nextForm);
      setErrors({});
      setSubmitError('');
      setIsEditMode(!client?.id);
      lastCepRef.current = onlyNumbers(nextForm.cep);
    } else {
      setForm(initialForm);
      setErrors({});
      setSubmitError('');
      setIsEditMode(false);
      lastCepRef.current = '';
    }
  }, [client, open]);

  React.useEffect(() => {
    const cleanCep = onlyNumbers(form.cep);

    if (cleanCep.length !== 8 || cleanCep === lastCepRef.current) {
      return undefined;
    }

    let isActive = true;
    lastCepRef.current = cleanCep;
    setIsCepLoading(true);

    getAddressByCep(cleanCep)
      .then((address) => {
        if (!isActive || !address) {
          return;
        }

        setForm((currentForm) => ({ ...currentForm, ...address }));
        setErrors((currentErrors) => ({ ...currentErrors, cep: undefined }));
      })
      .catch((error) => {
        if (isActive) {
          setErrors((currentErrors) => ({ ...currentErrors, cep: error.message }));
          toast.warning(error.message || 'Não foi possível buscar o CEP.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsCepLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [form.cep, toast]);

  const updateField = (field, value) => {
    if (isReadOnly) {
      return;
    }

    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isReadOnly) {
      return;
    }

    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        await updateClient(client.id, toPayload(form));
      } else {
        await createClient(toPayload(form));
      }

      toast.success(isEditing ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.');
      await onSaved();
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Não foi possível salvar o cliente.');
      toast.error(error.message || 'Não foi possível salvar o cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsEditMode(true);
  };

  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditing ? (isEditMode ? 'Editar cliente' : 'Ver cliente') : 'Novo cliente'}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" id="client-form" spacing={3} onSubmit={handleSubmit}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <FormSection title="Identificação">
            <TextField select label="Tipo de pessoa" value={form.personType} onChange={(event) => updateField('personType', event.target.value)} disabled={isReadOnly}>
              {personTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="CPF/CNPJ"
              value={form.cpf_or_cnpj}
              onChange={(event) => updateField('cpf_or_cnpj', formatCPFOrCNPJ(event.target.value))}
              error={Boolean(errors.cpf_or_cnpj)}
              helperText={errors.cpf_or_cnpj}
              disabled={isReadOnly}
              required
            />
            <TextField label="Nome" value={form.name} onChange={(event) => updateField('name', event.target.value)} error={Boolean(errors.name)} helperText={errors.name} disabled={isReadOnly} required />
          </FormSection>

          <Divider />

          <FormSection title="Endereço">
            <TextField
              label="CEP"
              value={form.cep}
              onChange={(event) => updateField('cep', formatZipCode(event.target.value))}
              error={Boolean(errors.cep)}
              helperText={errors.cep || (isCepLoading ? 'Buscando endereço...' : '')}
              InputProps={{
                endAdornment: isCepLoading ? <CircularProgress size={18} /> : null
              }}
              disabled={isReadOnly}
              required
            />
            <TextField label="Rua" value={form.street} onChange={(event) => updateField('street', event.target.value)} disabled={isReadOnly} />
            <TextField label="Número" value={form.number} onChange={(event) => updateField('number', event.target.value)} disabled={isReadOnly} />
            <TextField label="Bairro" value={form.district} onChange={(event) => updateField('district', event.target.value)} disabled={isReadOnly} />
            <TextField label="Cidade" value={form.city} onChange={(event) => updateField('city', event.target.value)} disabled={isReadOnly} />
            <TextField label="Estado" value={form.state} onChange={(event) => updateField('state', event.target.value)} disabled={isReadOnly} />
            <TextField label="Complemento" value={form.complement} onChange={(event) => updateField('complement', event.target.value)} disabled={isReadOnly} />
            <TextField label="País" value={form.country} onChange={(event) => updateField('country', event.target.value.toUpperCase().slice(0, 2))} disabled={isReadOnly} />
          </FormSection>

          <Divider />

          <FormSection title="Contato e dados pessoais">
            <TextField label="E-mail" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} error={Boolean(errors.email)} helperText={errors.email} disabled={isReadOnly} required />
            <TextField
              label="Celular"
              value={form.cellphone}
              onChange={(event) => updateField('cellphone', formatCellphone(event.target.value))}
              error={Boolean(errors.cellphone)}
              helperText={errors.cellphone}
              disabled={isReadOnly}
              required
            />
            <TextField label="Data de nascimento" type="date" value={form.birthdate} onChange={(event) => updateField('birthdate', event.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
            <TextField
              select
              label="Estado civil"
              value={form.marital_status}
              onChange={(event) => updateField('marital_status', event.target.value)}
              error={Boolean(errors.marital_status)}
              helperText={errors.marital_status}
              disabled={isReadOnly}
              required
            >
              {maritalStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Gênero" value={form.genre} onChange={(event) => updateField('genre', event.target.value)} error={Boolean(errors.genre)} helperText={errors.genre} disabled={isReadOnly} required>
              {genreOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormSection>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} disabled={isSaving}>
          {isReadOnly ? 'Fechar' : 'Cancelar'}
        </Button>
        {isReadOnly ? (
          <Button type="button" variant="contained" onClick={handleEnableEdit}>
            Editar
          </Button>
        ) : (
          <Button type="submit" form="client-form" variant="contained" disabled={isSaving}>
            {isSaving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar cliente'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ClientFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  client: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired
};
