// material-ui
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

// project imports
import { DEFAULT_THEME_MODE } from 'config';

// assets
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';

// ==============================|| CUSTOMIZATION - THEME MODE ||============================== //

export default function ThemeMode() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (_event, value) => {
    if (value) setMode(value);
  };

  return (
    <Stack sx={{ p: 2, gap: 2.5 }}>
      <Typography variant="h5">THEME MODE</Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={mode || DEFAULT_THEME_MODE}
        onChange={handleChange}
        aria-label="theme mode"
      >
        <Tooltip title="Sistema">
          <ToggleButton value="system" aria-label="system mode">
            <IconDeviceDesktop size={18} />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Claro">
          <ToggleButton value="light" aria-label="light mode">
            <IconSun size={18} />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Escuro">
          <ToggleButton value="dark" aria-label="dark mode">
            <IconMoon size={18} />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Stack>
  );
}
