import { PropsWithChildren, Suspense } from 'react';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Lottie from 'lottie-react';
import authDark from 'shared/assets/json/auth-dark.json';
import auth from 'shared/assets/json/auth.json';
import Logo from 'shared/components/common/Logo';
import DefaultLoader from 'shared/components/loading/DefaultLoader';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import { cssVarRgba } from 'shared/lib/utils';

const DefaultAuthLayout = ({ children }: PropsWithChildren) => {
  const { isDark } = useThemeMode();

  return (
    <Grid
      container
      sx={{
        height: { md: '100vh' },
        minHeight: '100vh',
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
      }}
    >
      <Grid
        sx={{
          borderRight: { md: 1 },
          borderColor: { md: 'divider' },
        }}
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Stack
          direction="column"
          sx={{
            justifyContent: 'space-between',
            height: 1,
            p: { xs: 3, sm: 5 },
          }}
        >
          <Stack
            sx={{
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: { xs: 5, md: 0 },
            }}
          >
            <Logo />
          </Stack>

          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: { xs: 'none', md: 'flex', flexDirection: 'row-reverse' },
              transform: (theme) => (theme.direction === 'rtl' ? 'scaleX(-1)' : 'unset'),
            }}
          >
            {isDark ? <Lottie animationData={authDark} /> : <Lottie animationData={auth} />}
          </Stack>

          <Stack
            sx={{
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                bgcolor: 'background.elevation1',
                p: 2,
                borderRadius: 3,
                border: 1,
                borderColor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
              }}
            >
              Sign in to continue to Kep.uz
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid
        size={{
          md: 6,
          xs: 12,
        }}
        sx={{
          display: { xs: 'flex', md: 'block' },
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Suspense fallback={<DefaultLoader />}>{children}</Suspense>
      </Grid>
    </Grid>
  );
};

export default DefaultAuthLayout;
