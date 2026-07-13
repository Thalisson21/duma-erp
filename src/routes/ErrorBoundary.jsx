import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function getErrorContent(error) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Página não encontrada',
        message: 'O endereço acessado não existe ou foi movido.'
      };
    }

    if (error.status === 401) {
      return {
        title: 'Acesso não autorizado',
        message: 'Sua sessão não tem permissão para acessar esta página.'
      };
    }

    if (error.status === 503) {
      return {
        title: 'Serviço indisponível',
        message: 'A API parece estar temporariamente fora do ar.'
      };
    }

    return {
      title: `Erro ${error.status}`,
      message: error.statusText || 'Não foi possível carregar esta página.'
    };
  }

  if (error?.message?.includes('Failed to fetch dynamically imported module')) {
    return {
      title: 'Não foi possível carregar a tela',
      message: 'Atualize a página para baixar a versão mais recente do módulo.'
    };
  }

  return {
    title: 'Algo deu errado',
    message: 'Ocorreu um erro inesperado ao abrir esta página.'
  };
}

// ==============================|| ELEMENT ERROR - COMMON ||============================== //

export default function ErrorBoundary() {
  const error = useRouteError();
  const { title, message } = getErrorContent(error);

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, bgcolor: 'background.default' }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 560, p: 3 }}>
        <Stack spacing={2}>
          <Alert severity="error">{title}</Alert>

          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography color="text.secondary">{message}</Typography>
          </Box>

          {import.meta.env.DEV && error?.message && (
            <Typography component="pre" sx={{ m: 0, p: 2, borderRadius: 1, bgcolor: 'grey.100', whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {error.message}
            </Typography>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Recarregar
            </Button>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
