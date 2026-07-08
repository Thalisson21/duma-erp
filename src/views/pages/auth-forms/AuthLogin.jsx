import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import useAuth from 'hooks/useAuth';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim());
  const canSubmit = isEmailValid && credentials.password.length > 0;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailTouched(true);

    if (!canSubmit) return;

    setError('');
    setIsSubmitting(true);

    try {
      await signIn(credentials);
      navigate('/dashboard/default', { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <CustomFormControl fullWidth error={emailTouched && !isEmailValid}>
        <InputLabel htmlFor="outlined-adornment-email-login">Insira seu E-mail</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          onBlur={() => setEmailTouched(true)}
          name="email"
          autoComplete="email"
          required
          label="Insira seu E-mail"
        />
        {emailTouched && !isEmailValid && <FormHelperText>Informe um endereço de e-mail válido.</FormHelperText>}
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-password-login">Senha</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={credentials.password}
          onChange={handleChange}
          name="password"
          autoComplete="current-password"
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Senha"
        />
      </CustomFormControl>

      <Grid container sx={{ justifyContent: 'flex-end' }}>
        <Grid>
          <Typography variant="subtitle1" component={Link} to="#!" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
            Esqueceu sua senha?
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" disabled={isSubmitting || !canSubmit} fullWidth size="large" type="submit" variant="contained">
            {isSubmitting ? <CircularProgress color="inherit" size={24} /> : 'Entrar'}
          </Button>
        </AnimateButton>
      </Box>
    </Box>
  );
}
