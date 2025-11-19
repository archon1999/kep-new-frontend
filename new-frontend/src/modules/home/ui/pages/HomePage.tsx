import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GreetingCard from '../components/GreetingCard';
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
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <GreetingCard displayName={displayName} ratings={ratings} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
