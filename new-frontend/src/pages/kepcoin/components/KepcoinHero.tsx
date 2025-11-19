import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

interface KepcoinHeroProps {
  balance: number | null;
  loading?: boolean;
}

const KepcoinHero = ({ balance, loading }: KepcoinHeroProps) => {
  const { t } = useTranslation();

  const formattedBalance = balance === null ? '--' : balance.toLocaleString();

  return (
    <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
      <Typography variant="h4" fontWeight={700} color="text.primary">
        {t('kepcoin.title')}
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Typography variant="h5" fontWeight={600} color="text.secondary">
          {t('kepcoin.youHave')}
        </Typography>

        {loading ? (
          <Skeleton variant="text" width={120} height={40} />
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {formattedBalance}
            </Typography>
            <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 32, height: 32 }} />
          </Stack>
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {t('kepcoin.subtitle')}
      </Typography>
    </Stack>
  );
};

export default KepcoinHero;
