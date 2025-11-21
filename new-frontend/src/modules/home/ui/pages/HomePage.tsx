import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import HomeProfileSection from '../components/HomeProfileSection.tsx';
import BirthdaysSection from '../components/BirthdaysSection';
import StatisticsSection from '../components/StatisticsSection.tsx';
import UserActivitySection from '../components/UserActivitySection.tsx';
import { useAuth } from 'app/providers/AuthProvider';
import { useUserActivityHistory, useUserRatings } from '../../application/queries';
import NewsSection from '../components/NewsSection.tsx';
import TopUsersSection from '../components/TopUsersSection.tsx';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const username = currentUser?.username;
  const displayName = currentUser?.firstName?.trim() || username || t('homePage.greeting.defaultName');
  const { data: ratings, isLoading } = useUserRatings(username);
  const { data: activityHistory, isLoading: isActivityLoading } = useUserActivityHistory(username);

  return (
    <Box>
      <Grid container>
        <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
          <HomeProfileSection
            displayName={displayName}
            ratings={ratings}
            isLoading={isLoading}
            activityHistory={activityHistory}
            isActivityLoading={isActivityLoading}
            username={username}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
          <Grid container>
            <Grid size={12}>
              <NewsSection />
            </Grid>

            <Grid size={12}>
              <TopUsersSection />
            </Grid>

            <Grid size={12}>
              <UserActivitySection />
            </Grid>

            <Grid size={12}>
              <StatisticsSection />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BirthdaysSection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
