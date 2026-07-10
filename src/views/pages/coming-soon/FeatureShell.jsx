import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

export default function FeatureShell({ title, description }) {
  return (
    <MainCard title={title}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            {description}
          </Typography>
          <Box sx={{ pt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Estrutura inicial criada para receber filtros, tabelas, formulários e ações desta funcionalidade.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </MainCard>
  );
}

FeatureShell.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
