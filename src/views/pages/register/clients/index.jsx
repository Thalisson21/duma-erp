import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { IconPlus } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';

// ==============================|| CLIENTS ||============================== //

export default function ClientsPage() {
  return (
    <MainCard
      title="Clientes"
      secondary={
        <Button variant="contained" startIcon={<IconPlus size={18} />}>
          Novo cliente
        </Button>
      }
    >
      <Stack spacing={1}>
        <Typography variant="h4">Registro de clientes</Typography>
        <Typography variant="body2" color="text.secondary">
          Consulte e gerencie os clientes cadastrados no sistema.
        </Typography>
      </Stack>
    </MainCard>
  );
}
