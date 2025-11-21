import { useTranslation } from 'react-i18next';
import { LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useUserAchievements } from 'modules/users/application/queries';

interface UserAchievementsSectionProps {
  username: string;
}

const UserAchievementsSection = ({ username }: UserAchievementsSectionProps) => {
  const { t } = useTranslation();
  const { data: achievements, isLoading } = useUserAchievements(username);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={240} />;
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Paper background={1} sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('users.profile.noAchievements')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      {achievements.map((achievement) => {
        const progress = achievement.userResult?.progress ?? 0;
        const completed = achievement.userResult?.done;

        return (
          <Paper
            key={achievement.id}
            background={1}
            sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={700}>
                {achievement.title}
              </Typography>

              {completed ? (
                <Typography variant="caption" color="success.main">
                  {t('users.profile.completed')}
                </Typography>
              ) : null}
            </Stack>

            {achievement.description ? (
              <Typography variant="body2" color="text.secondary">
                {achievement.description}
              </Typography>
            ) : null}

            <LinearProgress
              variant="determinate"
              value={Math.min(100, (progress / (achievement.totalProgress || 100)) * 100)}
            />
          </Paper>
        );
      })}
    </Stack>
  );
};

export default UserAchievementsSection;
