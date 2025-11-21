import { useMemo } from 'react';
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDuelDetail } from '../../application/queries.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const DuelDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: duel } = useDuelDetail(id);

  const problems = useMemo(() => duel?.preset?.problems ?? [], [duel]);

  if (!duel) {
    return (
      <Stack alignItems="center" justifyContent="center" py={6} spacing={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {t('duels.loading')}
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('duels.detailTitle', { id: duel.id })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {duel.preset?.title}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{duel.playerFirst.username[0]}</Avatar>
                <Stack>
                  <Typography variant="subtitle1">{duel.playerFirst.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {duel.playerFirst.ratingTitle}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="overline" color="text.secondary">
                {t('duels.vs')}
              </Typography>
              {duel.playerSecond ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{duel.playerSecond.username[0]}</Avatar>
                  <Stack>
                    <Typography variant="subtitle1">{duel.playerSecond.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {duel.playerSecond.ratingTitle}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('duels.waitingForOpponent')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip label={t('duels.statusLabel', { status: duel.status })} />
              {duel.preset?.difficultyDisplay && <Chip label={duel.preset.difficultyDisplay} />}
              {duel.startTime && <Chip label={`${t('duels.startTime')}: ${duel.startTime}`} />}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">{t('duels.problemsTitle')}</Typography>
              <Grid container spacing={2}>
                {problems.map((problem) => (
                  <Grid item xs={12} md={6} key={problem.id}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">{problem.symbol}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('duels.problemBall', { ball: problem.ball })}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
                {!problems.length && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {t('duels.noProblems')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default DuelDetailPage;
