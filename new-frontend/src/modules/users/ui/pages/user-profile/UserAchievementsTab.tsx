import { LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { useUserAchievements } from 'modules/users/application/queries';
import type { UserAchievement } from 'modules/users/domain/entities/user.entity';
import type { UserProfileOutletContext } from './UserProfilePage';

const AchievementCard = ({ achievement }: { achievement: UserAchievement }) => {
  const { t } = useTranslation();
  const progressValue = useMemo(() => {
    const total = achievement.totalProgress ?? 0;
    if (!total) return 0;
    const progress = achievement.userResult?.progress ?? 0;
    return Math.min(100, Math.round((progress / total) * 100));
  }, [achievement.totalProgress, achievement.userResult?.progress]);

  return (
    <Paper background={1} sx={{ p: 3 }}>
      <Stack direction="column" spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>
            {achievement.title ?? t('users.profile.achievements.untitled')}
          </Typography>

          {achievement.userResult?.done ? (
            <Typography variant="caption" color="success.main" fontWeight={700}>
              {t('users.profile.achievements.completed')}
            </Typography>
          ) : null}
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {achievement.description ?? t('users.profile.achievements.noDescription')}
        </Typography>

        <Stack direction="column" spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {t('users.profile.achievements.progress')}
            </Typography>

            <Typography variant="caption" fontWeight={700}>
              {achievement.userResult?.progress ?? 0} / {achievement.totalProgress ?? 0}
            </Typography>
          </Stack>

          <LinearProgress variant="determinate" value={progressValue} />
        </Stack>
      </Stack>
    </Paper>
  );
};

const UserAchievementsTab = () => {
  const { username } = useOutletContext<UserProfileOutletContext>();
  const { t } = useTranslation();
  const { data: achievements, isLoading } = useUserAchievements(username);

  const showEmpty = !isLoading && (!achievements || achievements.length === 0);

  return (
    <Stack direction="column" spacing={2}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rounded" height={120} />)
        : showEmpty
          ? (
            <Paper background={1} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t('users.profile.achievements.empty')}
              </Typography>
            </Paper>
            )
          : achievements?.map((achievement) => (
            <AchievementCard key={achievement.id ?? achievement.title} achievement={achievement} />
          ))}
    </Stack>
  );
};

export default UserAchievementsTab;
