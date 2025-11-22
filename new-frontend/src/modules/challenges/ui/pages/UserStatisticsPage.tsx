import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { LineChart, GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import ReactEchart from 'shared/components/base/ReactEchart.tsx';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
  useUserChallenges,
} from '../../application/queries.ts';
import ChallengeCard from '../components/ChallengeCard.tsx';
import ChallengeUserChip from '../components/ChallengeUserChip.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const UserStatisticsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const username = currentUser?.username;
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const { data: userRating } = useChallengeUserRating(username);
  const { data: ratingChanges } = useChallengeRatingChanges(username);
  const { data: lastChallenges, isLoading: isChallengesLoading } = useUserChallenges({
    username: username ?? '',
    page,
    pageSize,
  });

  const totalRatingChange = useMemo(
    () => (ratingChanges ?? []).reduce((acc, item) => acc + (item.value ?? 0), 0),
    [ratingChanges],
  );

  const ratingChangesOptions: EChartsCoreOption = useMemo(
    () => ({
      grid: { left: 36, right: 12, bottom: 28, top: 10 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: (ratingChanges ?? []).map((item) => item.date?.slice(0, 10)),
        boundaryGap: false,
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          data: (ratingChanges ?? []).map((item) => item.value ?? 0),
          areaStyle: {},
          smooth: true,
        },
      ],
    }),
    [ratingChanges],
  );

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

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5} direction="column">
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('challenges.currentRank')}
                  </Typography>
                  {userRating ? (
                    <>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h5" fontWeight={800}>
                          {userRating.rating}
                        </Typography>
                        <ChallengesRatingChip title={userRating.rankTitle} size="small" />
                      </Stack>
                      <Typography
                        variant="caption"
                        color={totalRatingChange >= 0 ? 'success.main' : 'error.main'}
                      >
                        {t('challenges.delta', { value: totalRatingChange })}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={`W ${userRating.wins}`} size="small" color="success" variant="soft" />
                        <Chip label={`D ${userRating.draws}`} size="small" color="warning" variant="soft" />
                        <Chip label={`L ${userRating.losses}`} size="small" color="error" variant="soft" />
                        <Chip label={`Σ ${userRating.all}`} size="small" variant="outlined" />
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.noRating')}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5} direction="column">
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('challenges.ratingChanges')}
                  </Typography>
                  {ratingChanges?.length ? (
                    <ReactEchart
                      option={ratingChangesOptions}
                      echarts={echarts}
                      style={{ width: '100%', height: 240 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.noChanges')}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5} direction="column">
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
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
                {isChallengesLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            {t('common.loading', { defaultValue: 'Loading...' })}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  : (lastChallenges?.data ?? []).map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                {!isChallengesLoading && !lastChallenges?.data?.length && (
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.noChallenges')}
                  </Typography>
                )}
              </Stack>

              {(lastChallenges?.pagesCount ?? 0) > 1 && (
                <Box display="flex" justifyContent="flex-end">
                  <Pagination
                    color="primary"
                    shape="rounded"
                    page={page}
                    count={lastChallenges?.pagesCount ?? 0}
                    onChange={(_, value) => setPage(value)}
                  />
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default UserStatisticsPage;
