import { Box, Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ChallengesOverviewCard from '../components/ChallengesOverviewCard';
import QuickStartPresets from '../components/QuickStartPresets';
import ChallengeCallsList from '../components/ChallengeCallsList';
import ChallengesListCard from '../components/ChallengesListCard';
import ChallengesTopRatingCard from '../components/ChallengesTopRatingCard';

const ChallengesPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={4} height={1}>
      <PageHeader
        title={t('challenges.title')}
        breadcrumb={[
          { label: t('menu.practice'), url: '/practice/challenges' },
          { label: t('menu.challenges'), active: true },
        ]}
        actionComponent={null}
      />

      <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ChallengesOverviewCard />
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickStartPresets />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChallengeCallsList />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChallengesListCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChallengesTopRatingCard />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default ChallengesPage;
