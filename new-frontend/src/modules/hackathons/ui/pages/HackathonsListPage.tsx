import { useTranslation } from 'react-i18next';
import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import HackathonCard from '../components/HackathonCard';
import { useHackathonsList } from '../../application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const HackathonsListPage = () => {
  const { t } = useTranslation();
  const { data: pageResult, isLoading } = useHackathonsList();

  const hackathons = pageResult?.data ?? [];
  const showEmptyState = !isLoading && hackathons.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('menu.hackathons')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('hackathons.subtitle')}
            </Typography>
          </Box>

          {pageResult ? (
            <Chip
              label={t('hackathons.countLabel', { count: pageResult.total ?? pageResult.count ?? hackathons.length })} />
          ) : null}
        </Stack>

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('hackathons.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('hackathons.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={12} key={idx}>
                  <Skeleton variant="rounded" height={360} />
                </Grid>
              ))
              : hackathons.map((hackathon) => (
                <Grid size={12} key={hackathon.id}>
                  <HackathonCard hackathon={hackathon} />
                </Grid>
              ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default HackathonsListPage;
