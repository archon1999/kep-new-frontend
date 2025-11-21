import { useTranslation } from 'react-i18next';
import { Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useUserRatings } from '../../../application/queries';
import { useUserProblemsRating } from 'modules/problems/application/queries';
import { useChallengeUserRating } from 'modules/challenges/application/queries';
import KepIcon from 'shared/components/base/KepIcon';

const UserProfileRatingsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: problemsRating, isLoading: isProblemsLoading } = useUserProblemsRating(username);
  const { data: challengesRating, isLoading: isChallengesLoading } = useChallengeUserRating(username);

  const contestsRating = userRatings?.contestsRating;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="problems" fontSize={20} color="primary.main" />
                <Typography variant="h6" fontWeight={700}>
                  {t('problems.title')}
                </Typography>
              </Stack>

              {isProblemsLoading ? (
                <Skeleton variant="rectangular" height={120} />
              ) : (
                <Stack direction="column" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.profile.ratings.solved')}: {problemsRating?.solved ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.profile.ratings.rating')}: {problemsRating?.rating ?? '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.profile.ratings.rank')}: {problemsRating?.rank ?? '—'}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {Object.entries(problemsRating?.difficulties ?? {}).map(([difficulty, value]) => (
                      <Chip
                        key={difficulty}
                        label={`${t(`problems.difficulty.${difficulty}`, { defaultValue: difficulty })}: ${value}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="contests" fontSize={20} color="primary.main" />
                <Typography variant="h6" fontWeight={700}>
                  {t('contests.title')}
                </Typography>
              </Stack>

              {isRatingsLoading ? (
                <Skeleton variant="rectangular" height={100} />
              ) : contestsRating ? (
                <Stack direction="column" spacing={0.75}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={contestsRating.title ?? contestsRating.value ?? '—'}
                      color="primary"
                      variant="outlined"
                    />
                    {contestsRating.rank !== undefined ? (
                      <Chip label={`#${contestsRating.rank}`} size="small" />
                    ) : null}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.profile.ratings.rating')}: {contestsRating.value ?? '—'}
                  </Typography>
                  {contestsRating.percentile !== undefined ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('users.profile.ratings.percentile', { value: contestsRating.percentile })}
                    </Typography>
                  ) : null}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('users.emptyValue')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="challenges" fontSize={20} color="primary.main" />
                <Typography variant="h6" fontWeight={700}>
                  {t('challenges.title')}
                </Typography>
              </Stack>

              {isChallengesLoading ? (
                <Skeleton variant="rectangular" height={100} />
              ) : challengesRating ? (
                <Stack direction="column" spacing={0.75}>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.profile.ratings.rating')}: {challengesRating.rating}
                  </Typography>
                  <Chip label={challengesRating.rankTitle} size="small" color="primary" variant="outlined" />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`${t('users.profile.ratings.wins')}: ${challengesRating.wins}`} size="small" />
                    <Chip label={`${t('users.profile.ratings.draws')}: ${challengesRating.draws}`} size="small" />
                    <Chip label={`${t('users.profile.ratings.losses')}: ${challengesRating.losses}`} size="small" />
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('users.emptyValue')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserProfileRatingsTab;
