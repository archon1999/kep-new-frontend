import { useMemo } from 'react';
import {
  Backdrop,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { demoUser, useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import sitemap from 'app/routes/sitemap';
import { sidenavVibrantStyle } from 'app/theme/styles/vibrantNav';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';
import Logo from 'shared/components/common/Logo';
import VibrantBackground from 'shared/components/common/VibrantBackground';
import { useNavContext } from '../NavProvider';
import NavItem from './NavItem';

const StackedSidenav = () => {
  const {
    config: { sidenavCollapsed, drawerWidth, navigationMenuType, navColor },
    toggleNavbarCollapse,
  } = useSettingsContext();
  const { sidenavAppbarVariant } = useNavContext();
  const { currentBreakpoint } = useBreakpoints();
  const { currentUser } = useAuth();
  const user = useMemo(() => currentUser || demoUser, [currentUser]);
  const theme = useTheme();

  const drawer = (
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <Stack sx={{ height: 1 }}>
        {navColor === 'vibrant' && <VibrantBackground position="side" />}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 1,
            bgcolor: 'background.elevation2',
          }}
        >
          <Toolbar
            variant={sidenavAppbarVariant}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {navigationMenuType === 'sidenav' && <Logo showName={false} />}
          </Toolbar>

          <Toolbar variant={sidenavAppbarVariant} sx={{ p: { xs: 2 }, pr: { xs: 1 } }}>
            {navigationMenuType === 'sidenav' && (
              <Stack
                sx={{
                  alignItems: 'center',
                  gap: 1,
                  width: 1,
                }}
              >
                <StatusAvatar
                  status="online"
                  alt={user.name}
                  src={user.avatar || undefined}
                  sx={{ width: 36, height: 36 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textWrap: 'nowrap',
                  }}
                >
                  {user.name}
                </Typography>
                <IconButton sx={{ ml: 'auto' }}>
                  <IconifyIcon icon="material-symbols:settings-outline" />
                </IconButton>
              </Stack>
            )}
          </Toolbar>

          <Box sx={{ px: 1, pb: 2, flex: 1, overflow: 'hidden' }}>
            <List
              dense
              sx={{
                py: 0,
                height: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {sitemap.map((item) => (
                <NavItem key={item.pathName} item={item} level={0} />
              ))}
            </List>
          </Box>

          <Toolbar sx={{ padding: '0 !important', display: 'flex', justifyContent: 'center' }}>
            <IconButton sx={{ color: 'text.secondary' }} onClick={toggleNavbarCollapse}>
              <IconifyIcon
                icon={
                  sidenavCollapsed
                    ? 'material-symbols:left-panel-open-outline'
                    : 'material-symbols:left-panel-close-outline'
                }
              />
            </IconButton>
          </Toolbar>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box
      component="nav"
      className="stacked-sidenav"
      sx={[
        {
          width: { md: drawerWidth },
          flexShrink: { sm: 0 },
        },
        navColor === 'vibrant' && sidenavVibrantStyle,
      ]}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          [`& .${drawerClasses.paper}`]: {
            boxSizing: 'border-box',
            width: drawerWidth,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
        open
      >
        {drawer}
        <Divider />
      </Drawer>
      {currentBreakpoint === 'md' && (
        <Backdrop open={!sidenavCollapsed} sx={{ zIndex: 1199 }} onClick={toggleNavbarCollapse} />
      )}
    </Box>
  );
};

export default StackedSidenav;
