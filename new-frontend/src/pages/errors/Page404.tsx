import { Box, Button, Stack, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import animation404Dark from 'shared/assets/json/404-dark.json';
import animation404 from 'shared/assets/json/404.json';
import { useThemeMode } from 'shared/hooks/useThemeMode';

const Page404 = () => {
  const { isDark } = useThemeMode();
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        p: { xs: 2.5, sm: 5 },
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="column"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
        spacing={{ xs: 6, md: 8 }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: {
              xs: 300,
              sm: 500,
              md: 720,
              lg: 920,
            },
            maxHeight: {
              xs: '40vh',
              sm: '45vh',
              md: '55vh',
              lg: '60vh',
            },
          }}
        >
          <Lottie
            animationData={isDark ? animation404Dark : animation404}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'text.disabled',
              fontWeight: 'medium',
              mb: 2,
            }}
          >
            Page not found
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontWeight: 'normal',
              mb: 5,
            }}
          >
            No worries! Let’s take you back{' '}
            <Box
              component="br"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            />
            while our bear is searching everywhere
          </Typography>

          <Button variant="contained" href="/" size="large" sx={{ px: 7 }}>
            Go Back Home{' '}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Page404;
