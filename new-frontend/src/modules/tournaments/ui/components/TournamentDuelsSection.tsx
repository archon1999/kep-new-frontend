import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { TournamentDuel, TournamentStage } from '../../domain/entities/tournament.entity.ts';

interface TournamentDuelsSectionProps {
  stages: TournamentStage[];
  emptyTextKey?: string;
}

const DuelCard = ({ duel }: { duel: TournamentDuel }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {duel.playerFirst.username}
          </Typography>
          <Chip label={duel.playerFirst.balls ?? 0} size="small" color="primary" />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {duel.playerSecond ? duel.playerSecond.username : t('tournaments.bye')}
          </Typography>
          <Chip label={duel.playerSecond?.balls ?? 0} size="small" color="primary" />
        </Stack>
      </CardContent>
    </Card>
  );
};

const TournamentDuelsSection = ({ stages, emptyTextKey = 'tournaments.noDuels' }: TournamentDuelsSectionProps) => {
  const { t } = useTranslation();
  const hasDuels = stages.some((stage) => stage.duels.some((duel) => duel.duel));

  if (!hasDuels) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t(emptyTextKey)}
      </Typography>
    );
  }

  return (
    <Stack direction="column" spacing={3}>
      {stages.map((stage) => (
        <Box key={stage.number}>
          <Typography variant="h6" fontWeight={800} align="center" gutterBottom>
            {stage.title || t('tournaments.stageNumber', { number: stage.number })}
          </Typography>

          <Grid container spacing={2}>
            {stage.duels.map((stageDuel) =>
              stageDuel.duel ? (
                <Grid size={{ xs: 12, md: 6 }} key={`${stage.number}-${stageDuel.number}`}>
                  <DuelCard duel={stageDuel.duel} />
                </Grid>
              ) : null,
            )}
          </Grid>
        </Box>
      ))}
    </Stack>
  );
};

export default TournamentDuelsSection;
