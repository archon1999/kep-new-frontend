import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestUserStatistics } from '../../application/queries';
import { ContestUserStatisticsSolvedTime, ContestUserStatisticsTopAttempt } from '../../domain/entities/contest-user-statistics.entity';

const InfoCard = ({ label, value, helper }: { label: string; value: string | number; helper?: string }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={0.75} direction="column">
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          {value}
        </Typography>
        {helper ? (
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

const TimelineBar = ({ label, value }: { label: string; value: number }) => (
  <Stack direction="column" spacing={0.5}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
    <LinearProgress variant="determinate" value={Math.min(value, 100)} sx={{ height: 6, borderRadius: 1 }} />
  </Stack>
);

const AttemptEntry = ({ attempt }: { attempt: ContestUserStatisticsTopAttempt }) => (
  <Stack direction="column" spacing={0.5}>
    <Typography variant="body2" fontWeight={600}>
      {attempt.problemSymbol}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {attempt.contestTitle}
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        size="small"
        label={attempt.solved ? '✓' : '✕'}
        color={attempt.solved ? 'success' : 'default'}
        variant="soft"
      />
      <Typography variant="body2" color="text.secondary">
        {attempt.attemptsCount}
      </Typography>
    </Stack>
  </Stack>
);

const SolveTime = ({ label, value }: { label: string; value: ContestUserStatisticsSolvedTime | null }) => (
  <Stack spacing={0.5}>
    <Typography variant="subtitle2">{label}</Typography>
    {value ? (
      <Typography variant="body2" color="text.secondary">
        {value.contestTitle} · {value.problemSymbol} · {value.time}
      </Typography>
    ) : (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    )}
  </Stack>
);

const ContestUserStatisticsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username ?? null;

  const { data: stats } = useContestUserStatistics(username);

  if (!username) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Typography variant="body1">{t('contests.userStatistics.authRequired')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {t('contests.userStatistics.header')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('contests.userStatistics.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <InfoCard
              label={t('contests.userStatistics.currentRating')}
              value={stats?.general.rating ?? '—'}
              helper={stats?.general.ratingTitle}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InfoCard
              label={t('contests.userStatistics.bestRating')}
              value={stats?.general.maxRating ?? '—'}
              helper={stats?.general.maxRatingTitle}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InfoCard
              label={t('contests.userStatistics.rank')}
              value={`#${stats?.general.ratingPlace ?? '—'}`}
              helper={t('contests.userStatistics.outOf', { total: stats?.general.contestantsCount ?? 0 })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={1.25}>
                  <Typography variant="caption" color="text.secondary">
                    {t('contests.userStatistics.ratingTitle')}
                  </Typography>
                  <ContestsRatingChip title={stats?.general.ratingTitle} withTitle imgSize={28} />
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.userStatistics.participants', { total: stats?.general.contestantsCount ?? 0 })}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">{t('contests.userStatistics.overview')}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <InfoCard label={t('contests.totalAttempts')} value={stats?.overview.totalAttempts ?? '—'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InfoCard label={t('contests.totalAccepted')} value={stats?.overview.totalAccepted ?? '—'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InfoCard
                    label={t('contests.userStatistics.averageAttemptsPerProblem')}
                    value={stats?.overview.averageAttemptsPerProblem?.toFixed?.(2) ?? '—'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InfoCard
                    label={t('contests.userStatistics.singleAttemptProblems')}
                    value={stats?.overview.singleAttemptProblems?.count ?? 0}
                    helper={stats?.overview.singleAttemptProblems?.percentage ? `${stats.overview.singleAttemptProblems.percentage}%` : undefined}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <SolveTime label={t('contests.userStatistics.fastestSolve')} value={stats?.overview.fastestSolve ?? null} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SolveTime label={t('contests.userStatistics.slowestSolve')} value={stats?.overview.slowestSolve ?? null} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">{t('contests.userStatistics.mostAttemptsProblem')}</Typography>
                    {stats?.overview.mostAttemptsProblem ? (
                      <Typography variant="body2" color="text.secondary">
                        {stats.overview.mostAttemptsProblem.problemSymbol} · {stats.overview.mostAttemptsProblem.contestTitle}
                        {' · '}
                        {stats.overview.mostAttemptsProblem.attemptsCount}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.contestRanks')}</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <InfoCard
                      label={t('contests.userStatistics.bestRank')}
                      value={stats?.contestRanks?.best ? `#${stats.contestRanks.best.rank}` : '—'}
                      helper={stats?.contestRanks?.best?.contestTitle}
                    />
                    <InfoCard
                      label={t('contests.userStatistics.toughestRank')}
                      value={stats?.contestRanks?.worst ? `#${stats.contestRanks.worst.rank}` : '—'}
                      helper={stats?.contestRanks?.worst?.contestTitle}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.ratingChanges')}</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <InfoCard
                      label={t('contests.userStatistics.bestDelta')}
                      value={stats?.contestDeltas?.best?.delta ?? '—'}
                      helper={stats?.contestDeltas?.best?.contestTitle}
                    />
                    <InfoCard
                      label={t('contests.userStatistics.worstDelta')}
                      value={stats?.contestDeltas?.worst?.delta ?? '—'}
                      helper={stats?.contestDeltas?.worst?.contestTitle}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.timeline')}</Typography>
                  <Stack spacing={1}>
                    {(stats?.timeline ?? []).map((item) => (
                      <TimelineBar key={item.range} label={item.range} value={item.attempts} />
                    ))}
                    {!stats?.timeline?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noData')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.languages')}</Typography>
                  <Stack spacing={1}>
                    {(stats?.languages ?? []).map((lang) => (
                      <TimelineBar key={lang.lang} label={lang.langFull ?? lang.lang} value={lang.attemptsCount} />
                    ))}
                    {!stats?.languages?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noData')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.verdicts')}</Typography>
                  <Stack spacing={1}>
                    {(stats?.verdicts ?? []).map((verdict) => (
                      <TimelineBar key={verdict.verdict} label={verdict.verdict} value={verdict.attemptsCount} />
                    ))}
                    {!stats?.verdicts?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noData')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.tags')}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(stats?.tags ?? []).map((tag) => (
                      <Chip key={tag.name} label={`${tag.name} · ${tag.solved}`} variant="soft" />
                    ))}
                    {!stats?.tags?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noData')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h6">{t('contests.userStatistics.symbols')}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(stats?.symbols ?? []).map((symbol) => (
                  <Chip key={symbol.symbol} label={`${symbol.symbol} · ${symbol.solved}`} variant="soft" />
                ))}
                {!stats?.symbols?.length && (
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.userStatistics.noData')}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h6">{t('contests.userStatistics.unsolvedProblems')}</Typography>
              <Stack spacing={1}>
                {(stats?.unsolvedProblems ?? []).map((problem) => (
                  <Stack key={`${problem.contestId}-${problem.problemSymbol}`} direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      size="small"
                      label={problem.problemSymbol}
                      component={RouterLink}
                      to={getResourceById(resources.Contest, problem.contestId)}
                      clickable
                    />
                    <Typography variant="body2" color="text.secondary">
                      {problem.contestTitle}
                    </Typography>
                  </Stack>
                ))}
                {!stats?.unsolvedProblems?.length && (
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.userStatistics.noUnsolvedProblems')}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.topAttempts')}</Typography>
                  <Stack spacing={1}>
                    {(stats?.topAttempts ?? []).map((attempt) => (
                      <AttemptEntry key={`${attempt.contestId}-${attempt.problemSymbol}`} attempt={attempt} />
                    ))}
                    {!stats?.topAttempts?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noData')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">{t('contests.userStatistics.worthyOpponents')}</Typography>
                  <Stack spacing={1.5}>
                    {(stats?.worthyOpponents ?? []).map((opponent) => (
                      <Card key={opponent.opponent} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                        <CardContent>
                          <Stack spacing={0.75}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle2">{opponent.opponent}</Typography>
                              <Chip label={opponent.type} size="small" variant="soft" color="neutral" />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {opponent.sharedCount} {t('contests.userStatistics.sharedContests')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {opponent.userWins} {t('contests.userStatistics.userWins')} · {opponent.opponentWins}{' '}
                              {t('contests.userStatistics.opponentWins')}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    {!stats?.worthyOpponents?.length && (
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.userStatistics.noOpponents')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ContestUserStatisticsPage;
