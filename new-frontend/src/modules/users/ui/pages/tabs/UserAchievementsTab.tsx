import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUserAchievements, useUserCompetitionPrizes } from '../../../application/queries';
import { useUserProfileContext } from '../UserProfilePage';

const UserAchievementsTab = () => {
  const { username } = useUserProfileContext();
  const { t } = useTranslation();
  const { data: achievements } = useUserAchievements(username);
  const { data: prizes } = useUserCompetitionPrizes(username);

  return (
    <Stack direction="column" spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('userProfile.tabs.achievements')}
          </Typography>

          {achievements?.length ? (
            achievements.map((achievement) => (
              <Paper key={achievement.id ?? achievement.title} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                  {achievement.userResult?.progress !== undefined && achievement.totalProgress ? (
                    <Stack direction="column" spacing={0.5}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          (achievement.userResult.progress / achievement.totalProgress) * 100,
                          100,
                        )}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {achievement.userResult.progress} / {achievement.totalProgress}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.achievements.empty')}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('userProfile.achievements.prizes')}
          </Typography>

          {prizes?.length ? (
            prizes.map((prize, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {prize.competitionTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prize.prizeTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {prize.prizeType}
                  </Typography>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.achievements.empty')}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default UserAchievementsTab;
