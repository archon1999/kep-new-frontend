import { useTranslation } from 'react-i18next';
import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import { HomeUserActivityHistory } from 'modules/home/domain/entities/home.entity';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';

interface UserActivityHistoryTabProps {
  username: string;
  history?: HomeUserActivityHistory | null;
  isLoading?: boolean;
  showHeader?: boolean;
}

const UserActivityHistoryTab = ({ username, history, isLoading, showHeader = true }: UserActivityHistoryTabProps) => {
  const { t } = useTranslation();

  if (isLoading && !history) {
    return <Skeleton variant="rounded" height={320} />;
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="column" spacing={2}>
        {showHeader && (
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.tabs.activityHistory')}
          </Typography>
        )}

        <HomeActivityHistory username={username} history={history ?? undefined} isLoading={isLoading} />
      </Stack>
    </Paper>
  );
};

export default UserActivityHistoryTab;
