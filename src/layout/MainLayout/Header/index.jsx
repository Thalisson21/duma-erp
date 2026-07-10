// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import useAuth from 'hooks/useAuth';
import { isMasterUser } from 'utils/permissions';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconDeviceDesktop, IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const canAccessAdmin = isMasterUser(user);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            color: theme.vars.palette.secondary.dark,
            background: theme.vars.palette.secondary.light,
            '&:hover': {
              color: theme.vars.palette.secondary.light,
              background: theme.vars.palette.secondary.dark
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification */}
      <NotificationSection />

      {canAccessAdmin && (
        <Tooltip title="Administração">
          <IconButton
            color="primary"
            aria-label="Abrir administração"
            onClick={() => navigate('/admin')}
            sx={{
              ml: 1,
              width: 44,
              height: 44,
              color: isAdminPage ? 'primary.contrastText' : 'primary.main',
              bgcolor: isAdminPage ? 'primary.main' : 'primary.light',
              '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' }
            }}
          >
            <IconDeviceDesktop stroke={1.5} size="22px" />
          </IconButton>
        </Tooltip>
      )}

      {/* profile */}
      <ProfileSection />
    </>
  );
}
