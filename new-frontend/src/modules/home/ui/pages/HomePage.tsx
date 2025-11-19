import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HomeProfileSection from '../components/HomeProfileSection.tsx';
import { useAuth } from 'app/providers/AuthProvider';
import { useUserRatings, useUsersChart } from '../../application/queries';
import UserActivitySection from '../components/UserActivitySection';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const username = currentUser?.username;
  const displayName = currentUser?.firstName?.trim() || username || t('homePage.greeting.defaultName');
  const { data: ratings, isLoading } = useUserRatings(username);
  const { data: usersChart, isLoading: isUsersChartLoading } = useUsersChart();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }} sx={{ height: 1 }}>
          <HomeProfileSection displayName={displayName} ratings={ratings} isLoading={isLoading} />
        </Grid>

        <Grid size={{ xs: 12, md: 7, lg: 8, xl: 9 }}>
          <UserActivitySection data={usersChart} isLoading={isUsersChartLoading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
