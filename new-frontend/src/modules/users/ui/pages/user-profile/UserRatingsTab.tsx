import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useOutletContext } from 'react-router';
import { useUserRatings } from 'modules/users/application/queries';
import RanksSection from 'modules/home/ui/components/RanksSection';
import type { UserProfileOutletContext } from './UserProfilePage';

const UserRatingsTab = () => {
  const { username } = useOutletContext<UserProfileOutletContext>();
  const { data: ratings, isLoading } = useUserRatings(username);

  const normalizedRatings = useMemo(() => ratings || null, [ratings]);

  return (
    <Stack direction="column" spacing={3}>
      <RanksSection ratings={normalizedRatings as any} isLoading={isLoading} />
    </Stack>
  );
};

export default UserRatingsTab;
