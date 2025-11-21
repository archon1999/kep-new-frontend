import { Paper, Stack } from '@mui/material';
import { useUserProfileContext } from '../UserProfilePage';
import { useUserActivityHistory } from 'modules/home/application/queries';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';

const UserActivityHistoryTab = () => {
  const { username } = useUserProfileContext();
  const { data, isLoading } = useUserActivityHistory(username);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="column" spacing={2}>
        <HomeActivityHistory username={username} history={data} isLoading={isLoading} />
      </Stack>
    </Paper>
  );
};

export default UserActivityHistoryTab;
