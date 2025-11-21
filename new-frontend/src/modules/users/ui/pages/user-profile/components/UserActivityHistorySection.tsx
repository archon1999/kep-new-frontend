import { Paper, Skeleton, Stack } from '@mui/material';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';
import { useUserActivityHistory } from 'modules/home/application/queries';

interface UserActivityHistorySectionProps {
  username: string;
}

const UserActivityHistorySection = ({ username }: UserActivityHistorySectionProps) => {
  const { data: history, isLoading } = useUserActivityHistory(username, 10);

  return (
    <Paper background={1} sx={{ p: 3 }}>
      {isLoading ? <Skeleton variant="rectangular" height={200} /> : null}
      <Stack direction="column" spacing={2}>
        <HomeActivityHistory username={username} history={history} isLoading={isLoading} />
      </Stack>
    </Paper>
  );
};

export default UserActivityHistorySection;
