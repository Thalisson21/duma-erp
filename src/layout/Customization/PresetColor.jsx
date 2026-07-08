// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import useConfig from 'hooks/useConfig';

// assets
import { IconCheck } from '@tabler/icons-react';

const presets = [
  { id: 'default', label: 'Berry', primary: '#2196f3', secondary: '#673ab7' },
  { id: 'ocean', label: 'Ocean', primary: '#2563eb', secondary: '#0f766e' },
  { id: 'emerald', label: 'Emerald', primary: '#16a34a', secondary: '#d97706' },
  { id: 'rose', label: 'Rose', primary: '#e11d48', secondary: '#0284c7' }
];

// ==============================|| CUSTOMIZATION - PRESET COLOR ||============================== //

export default function PresetColor() {
  const {
    state: { presetColor },
    setField
  } = useConfig();

  const handleChange = (event) => {
    setField('presetColor', event.target.value);
  };

  return (
    <Stack sx={{ p: 2, gap: 2.5 }}>
      <Typography variant="h5">COLOR PALETTE</Typography>
      <RadioGroup value={presetColor || 'default'} onChange={handleChange} aria-label="color palette" name="color-palette">
        <Grid container spacing={1.25}>
          {presets.map((item) => {
            const selected = (presetColor || 'default') === item.id;

            return (
              <Grid key={item.id} size={3}>
                <Tooltip title={item.label}>
                  <Box component="label" sx={{ cursor: 'pointer', display: 'block' }}>
                    <Radio value={item.id} sx={{ display: 'none' }} />
                    <Box
                      sx={{
                        height: 46,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: selected ? 'primary.main' : 'divider',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ bgcolor: item.primary }} />
                      <Box sx={{ bgcolor: item.secondary }} />
                      {selected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'common.white',
                            bgcolor: 'rgba(0, 0, 0, 0.22)'
                          }}
                        >
                          <IconCheck size={18} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>
    </Stack>
  );
}
