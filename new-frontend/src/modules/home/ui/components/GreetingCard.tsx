import dayjs from 'dayjs';
import { Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface GreetingCardProps {
  name: string;
}

const GreetingCard = ({ name }: GreetingCardProps) => {
  const { t } = useTranslation();
  const formattedDate = dayjs().format('dddd, MMM DD, YYYY');

  return (
    <Paper
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        p: { xs: 3, md: 5 },
        bgcolor: 'transparent',
        color: 'common.white',
        backgroundImage: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 240,
          height: 240,
          right: -60,
          top: -80,
          background: (theme) => alpha(theme.palette.common.white, 0.1),
          filter: 'blur(12px)',
          borderRadius: '50%',
        },
      }}
    >
      <Stack spacing={2} sx={{ position: 'relative' }}>
        <Typography variant="subtitle2" sx={{ color: alpha('#fff', 0.85), fontWeight: 500 }}>
          {formattedDate}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('homePage.greeting.title', { name })}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), maxWidth: 480 }}>
          {t('homePage.greeting.subtitle')}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default GreetingCard;
