import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useUserRatings } from '../../application/queries';
import GreetingCard from '../components/GreetingCard';
import RanksSection from '../components/RanksSection';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const username = currentUser?.username;

  const displayName = useMemo(
    () =>
      currentUser?.firstName ||
      (currentUser as any)?.first_name ||
      currentUser?.name ||
      currentUser?.username ||
      currentUser?.email ||
      t('homePage.greeting.defaultName'),
    [currentUser, t],
  );

  const { data: ratings, isLoading: ratingsLoading } = useUserRatings(username);

  return (
    <Stack spacing={4} sx={{ flex: 1, px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
      <GreetingCard name={displayName} />
      <RanksSection ratings={ratings} isLoading={ratingsLoading} />
    </Stack>
  );
};

export default HomePage;
