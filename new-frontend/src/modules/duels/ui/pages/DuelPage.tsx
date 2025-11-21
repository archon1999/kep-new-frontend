import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Box, Card, CardContent, Chip, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDuelDetails, useDuelResults } from '../../application/queries.ts';
import { DuelProblem } from '../../domain/entities/duel.entity.ts';

const DuelPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: duel, isLoading } = useDuelDetails(id);
  const { data: duelResults } = useDuelResults(id, Boolean(duel && duel.status === 0));

  const problems: DuelProblem[] = useMemo(
    () =>
      (duel?.problems ?? []).map((problem, index) => ({
        ...problem,
        playerFirstBall: duelResults?.playerFirst?.[index] ?? problem.playerFirstBall,
        playerSecondBall: duelResults?.playerSecond?.[index] ?? problem.playerSecondBall,
      })),
    [duel?.problems, duelResults?.playerFirst, duelResults?.playerSecond],
  );

  const playerFirstScore = useMemo(
    () => problems.reduce((total, item) => total + (item.playerFirstBall ?? 0), 0),
    [problems],
  );
  const playerSecondScore = useMemo(
    () => problems.reduce((total, item) => total + (item.playerSecondBall ?? 0), 0),
    [problems],
  );

  const statusLabel = useMemo(() => {
    switch (duel?.status) {
      case -1:
        return t('duels.statusUpcoming');
      case 0:
        return t('duels.statusRunning');
      case 1:
      default:
        return t('duels.statusFinished');
    }
  }, [duel?.status, t]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {t('duels.detailsTitle', {
              playerFirst: duel?.playerFirst?.username ?? '—',
              playerSecond: duel?.playerSecond?.username ?? '—',
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.detailsSubtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            {isLoading || !duel ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} alignItems="center">
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography fontWeight={700}>{duel.playerFirst?.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('duels.playersVs')}
                      </Typography>
                      {duel.playerSecond ? (
                        <Typography fontWeight={700}>{duel.playerSecond.username}</Typography>
                      ) : (
                        <Chip label="BYE" size="small" />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {t('duels.startsAt')}: {dayjs(duel.startTime).format('DD MMM YYYY, HH:mm')}
                      </Typography>
                      {duel.finishTime ? (
                        <Typography variant="body2" color="text.secondary">
                          • {t('duels.endsAt')}: {dayjs(duel.finishTime).format('DD MMM YYYY, HH:mm')}
                        </Typography>
                      ) : null}
                    </Stack>
                    <Chip label={statusLabel} color={duel.status === 0 ? 'success' : 'default'} size="small" />
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Stack spacing={0.25} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {duel.playerFirst?.username}
                      </Typography>
                      <Typography variant="h4" color="primary.main" fontWeight={800}>
                        {playerFirstScore}
                      </Typography>
                    </Stack>
                    {duel.playerSecond ? (
                      <Stack spacing={0.25} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {duel.playerSecond.username}
                        </Typography>
                        <Typography variant="h4" color="primary.main" fontWeight={800}>
                          {playerSecondScore}
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>
                </Stack>

                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('duels.problem')}</TableCell>
                        <TableCell>{t('duels.ball')}</TableCell>
                        <TableCell>{t('duels.playerScore', { username: duel.playerFirst?.username ?? '' })}</TableCell>
                        <TableCell>{t('duels.playerScore', { username: duel.playerSecond?.username ?? '' })}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {problems.map((problem) => (
                        <TableRow key={problem.symbol} hover>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Typography fontWeight={700}>{problem.problem?.title ?? problem.symbol}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {problem.problem?.symbol ?? problem.symbol}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{problem.ball}</TableCell>
                          <TableCell>{problem.playerFirstBall}</TableCell>
                          <TableCell>{problem.playerSecondBall}</TableCell>
                        </TableRow>
                      ))}

                      {problems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant="body2" color="text.secondary">
                              {t('duels.noProblems')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default DuelPage;
