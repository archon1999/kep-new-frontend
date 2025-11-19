import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import HomeProfileSection from '../components/HomeProfileSection.tsx';
import StatisticsSection from '../components/StatisticsSection.tsx';
import { useAuth } from 'app/providers/AuthProvider';
import { useUserRatings } from '../../application/queries';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const username = currentUser?.username;
  const displayName = currentUser?.firstName?.trim() || username || t('homePage.greeting.defaultName');
  const { data: ratings, isLoading } = useUserRatings(username);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }} sx={{ height: 1 }}>
          <HomeProfileSection displayName={displayName} ratings={ratings} isLoading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8, xl: 9 }}>
          <StatisticsSection />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
