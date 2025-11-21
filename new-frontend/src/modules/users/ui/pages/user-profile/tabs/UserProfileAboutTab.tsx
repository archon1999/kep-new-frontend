import { Stack } from '@mui/material';
import UserActivityHistorySection from '../components/UserActivityHistorySection';
import UserRatingsSection from '../components/UserRatingsSection';
import { useProfileContext } from '../UserProfilePage';

const UserProfileAboutTab = () => {
  const { username } = useProfileContext();

  return (
    <Stack direction="column" spacing={2}>
      <UserRatingsSection username={username} />
      <UserActivityHistorySection username={username} />
    </Stack>
  );
};

export default UserProfileAboutTab;
