import { useTranslation } from 'react-i18next';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';
import { useUserActivityHistory } from 'modules/home/application/queries';

const UserProfileActivityHistoryTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { data, isLoading } = useUserActivityHistory(username, 20);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <HomeActivityHistory username={username} history={data ?? undefined} isLoading={isLoading} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfileActivityHistoryTab;
