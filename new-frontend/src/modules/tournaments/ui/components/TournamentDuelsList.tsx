import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { TournamentDuel, TournamentStage } from '../../domain/entities/tournament.entity';

interface Props {
  stages: TournamentStage[];
}

const DuelCard = ({ duel }: { duel: TournamentDuel }) => {
  const startLabel = useMemo(
    () => (duel.startTime ? dayjs(duel.startTime).format('MMM DD, HH:mm') : ''),
    [duel.startTime],
  );

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }} variant="outlined">
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {duel.playerFirst.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {duel.playerFirst.ratingTitle}
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          vs
        </Typography>

        <Stack spacing={0.5} alignItems="flex-end">
          <Typography variant="subtitle2" fontWeight={700}>
            {duel.playerSecond.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {duel.playerSecond.ratingTitle}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
        {startLabel ? <Chip size="small" label={startLabel} /> : null}
        <Chip size="small" label={`#${duel.number}`} variant="outlined" />
        {duel.presetDifficulty ? <Chip size="small" label={`D${duel.presetDifficulty}`} color="warning" /> : null}
      </Stack>
    </Paper>
  );
};

const TournamentDuelsList = ({ stages }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      {stages.map((stage) => (
        <Box key={stage.number}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              {stage.title || `Stage ${stage.number}`}
            </Typography>
            {stage.startTime ? (
              <Typography variant="body2" color="text.secondary">
                {dayjs(stage.startTime).format('MMM DD, YYYY HH:mm')}
              </Typography>
            ) : null}
          </Stack>

          <Grid container spacing={2}>
            {stage.duels.map((duel, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={`${stage.number}-${idx}`}>
                <DuelCard duel={duel} />
              </Grid>
            ))}
            {stage.duels.length === 0 ? (
              <Grid size={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('tournaments.noDuels')}
                  </Typography>
                </Paper>
              </Grid>
            ) : null}
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Stack>
  );
};

export default TournamentDuelsList;
