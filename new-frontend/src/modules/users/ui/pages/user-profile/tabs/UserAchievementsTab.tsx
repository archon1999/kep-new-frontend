import { useTranslation } from 'react-i18next';
import { LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { UserAchievements } from 'modules/users/domain/entities/userProfile.entity';

interface UserAchievementsTabProps {
  achievements?: UserAchievements | null;
  isLoading?: boolean;
}

const UserAchievementsTab = ({ achievements, isLoading }: UserAchievementsTabProps) => {
  const { t } = useTranslation();

  if (isLoading && !achievements) {
    return <Skeleton variant="rounded" height={280} />;
  }

  const items = achievements?.data ?? [];

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('users.profile.tabs.achievements')}
        </Typography>

        {items.length === 0 ? (
          <Typography color="text.secondary">{t('users.profile.achievements.empty')}</Typography>
        ) : (
          <Stack direction="column" spacing={1.5}>
            {items.map((item) => (
              <Stack key={item.id ?? item.title} direction="column" spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color={item.userResult?.done ? 'success.main' : 'text.secondary'}>
                    {item.userResult?.progress ?? 0}/{item.totalProgress ?? 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    item.totalProgress
                      ? Math.min(100, ((item.userResult?.progress ?? 0) / (item.totalProgress || 1)) * 100)
                      : 0
                  }
                  color={item.userResult?.done ? 'success' : 'primary'}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default UserAchievementsTab;
