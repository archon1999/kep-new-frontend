import { useMemo } from 'react';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
  useUserChallenges,
} from '../../application/queries.ts';
import ChallengeCard from '../components/ChallengeCard.tsx';
import ChallengeUserChip from '../components/ChallengeUserChip.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const UserStatisticsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const username = currentUser?.username;
  const { data: userRating } = useChallengeUserRating(username);
  const { data: ratingChanges } = useChallengeRatingChanges(username);
  const { data: lastChallenges } = useUserChallenges({ username: username ?? '', page: 1, pageSize: 5 });

  const totalRatingChange = useMemo(() =>
    (ratingChanges ?? []).reduce((acc, item) => acc + (item.value ?? 0), 0), [ratingChanges]);

  if (!username) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Typography variant="body1">{t('challenges.authRequired')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={0.5} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('challenges.statisticsTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.statisticsSubtitle')}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5} direction="column">
                <Typography variant="subtitle2" color="text.secondary">
                  {t('challenges.currentRank')}
                </Typography>
                {userRating ? (
                  <Stack spacing={0.5} direction="column">
                    <Typography variant="h5" fontWeight={800}>{userRating.rating}</Typography>
                    <ChallengesRatingChip title={userRating.rankTitle} size="small" />
                    <Typography variant="caption" color={totalRatingChange >= 0 ? 'success.main' : 'error.main'}>
                      {t('challenges.delta', { value: totalRatingChange })}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.noRating')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5} direction="column">
                <Typography variant="subtitle2" color="text.secondary">
                  {t('challenges.ratingChanges')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(ratingChanges ?? []).map((change) => (
                    <Chip
                      key={`${change.date}-${change.value}`}
                      label={`${change.date?.slice(0, 10)} · ${change.value > 0 ? '+' : ''}${change.value}`}
                      color={change.value > 0 ? 'success' : change.value < 0 ? 'error' : 'default'}
                      variant="soft"
                    />
                  ))}
                  {!ratingChanges?.length && (
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.noChanges')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5} direction="column">
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Typography variant="h6">{t('challenges.lastChallenges')}</Typography>
                {userRating && (
                  <ChallengeUserChip
                    player={{
                      username: userRating.username,
                      rating: userRating.rating,
                      newRating: userRating.rating,
                      rankTitle: userRating.rankTitle,
                      newRankTitle: userRating.rankTitle,
                      result: 0,
                      results: [],
                      delta: 0,
                    }}
                  />
                )}
              </Stack>

              <Stack spacing={1.5} direction="column">
                {(lastChallenges?.data ?? []).map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
                {!lastChallenges?.data?.length && (
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.noChallenges')}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default UserStatisticsPage;
