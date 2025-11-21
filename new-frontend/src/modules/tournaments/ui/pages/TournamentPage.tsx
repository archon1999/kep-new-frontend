import { useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, Divider, Grid, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useTournament } from '../../application/queries';
import TournamentBracket from '../components/TournamentBracket';

const TournamentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: tournament, isLoading } = useTournament(id);
  const [tab, setTab] = useState<'overview' | 'results' | 'schedule'>('overview');

  const stageList = useMemo(() => tournament?.stages ?? [], [tournament?.stages]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={2}>
          <Card background={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              {isLoading ? (
                <Stack direction="column" spacing={2}>
                  <Skeleton variant="text" height={36} width="40%" />
                  <Skeleton variant="rounded" height={24} width="60%" />
                  <Skeleton variant="text" height={18} width="30%" />
                </Stack>
              ) : (
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
                    <Typography variant="h4" fontWeight={800} sx={{ flex: 1, minWidth: 0 }} noWrap>
                      {tournament?.title}
                    </Typography>
                    <Chip label={t(`tournaments.type.${tournament?.type}`)} color="primary" />
                    <Chip
                      variant="outlined"
                      label={t('tournaments.playersCount', { count: tournament?.players?.length ?? 0 })}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:calendar-clock" />
                      <Typography variant="body2" color="text.secondary">
                        {tournament?.startTime}
                      </Typography>
                    </Stack>
                  </Stack>

                  {tournament?.description ? (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      component="div"
                      sx={{ '& p': { m: 0 } }}
                      dangerouslySetInnerHTML={{ __html: tournament.description }}
                    />
                  ) : null}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card background={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                allowScrollButtonsMobile
              >
                <Tab value="overview" label={t('tournaments.overview')} />
                <Tab value="results" label={t('tournaments.results')} />
                <Tab value="schedule" label={t('tournaments.schedule')} />
              </Tabs>
            </CardContent>
          </Card>
        </Stack>

        {tab === 'overview' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card background={1} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      {t('tournaments.participantsTitle')}
                    </Typography>
                    {isLoading ? (
                      <Stack direction="column" spacing={1}>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <Skeleton key={`participant-${index}`} variant="text" height={24} width="50%" />
                        ))}
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                        {(tournament?.players ?? []).map((player) => (
                          <Chip
                            key={player.id}
                            label={player.username}
                            icon={<IconifyIcon icon="mdi:account" />}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card background={1} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      {t('tournaments.quickFacts')}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:run-fast" />
                      <Typography variant="body2" color="text.secondary">
                        {t('tournaments.singleElimination')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:account-group" />
                      <Typography variant="body2" color="text.secondary">
                        {t('tournaments.knockoutPlayers', { count: tournament?.players?.length ?? 16 })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:clock-outline" />
                      <Typography variant="body2" color="text.secondary">
                        {t('tournaments.startLabel', { time: tournament?.startTime ?? '—' })}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        {tab === 'results' ? <TournamentBracket tournament={tournament} /> : null}

        {tab === 'schedule' ? (
          <Card background={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  {t('tournaments.schedule')}
                </Typography>
                {isLoading ? (
                  <Stack direction="column" spacing={1}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={`stage-${index}`} variant="text" height={24} />
                    ))}
                  </Stack>
                ) : stageList.length ? (
                  <Stack direction="column" spacing={1.5}>
                    {stageList.map((stage, index) => (
                      <Stack key={stage.number ?? index} direction="column" spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle1" fontWeight={700}>
                            {stage.title || t('tournaments.stageTitle', { number: stage.number })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stage.startTime || t('tournaments.tbd')}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {t('tournaments.matchesCount', { count: stage.duels?.length ?? 0 })}
                        </Typography>
                        {index < stageList.length - 1 ? <Divider /> : null}
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('tournaments.scheduleEmpty')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
};

export default TournamentPage;
