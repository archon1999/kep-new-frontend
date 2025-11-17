import { useTranslation } from 'react-i18next';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import VibrantBackground from 'shared/components/common/VibrantBackground';

const HomeHeader = () => {
  const { t } = useTranslation();
  const { sessionUser } = useAuth();

  const name =
    sessionUser?.firstName ||
    sessionUser?.username ||
    t('home.welcome_guest', { defaultValue: 'Guest' });
  const subtitle = t('HomePageTitle', {
    defaultValue: 'Track your learning journey and see what is new today.',
  });

  return (
    <Card sx={{ overflow: 'hidden', position: 'relative', borderRadius: 3 }}>
      <VibrantBackground position="absolute" />
      <CardContent
        sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={sessionUser?.avatar || undefined}
            alt={name as string}
            sx={{
              width: 56,
              height: 56,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            }}
          >
            {name?.toString().charAt(0).toUpperCase()}
          </Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6" color="text.secondary">
              {t('Welcome', { defaultValue: 'Welcome' })}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HomeHeader;
