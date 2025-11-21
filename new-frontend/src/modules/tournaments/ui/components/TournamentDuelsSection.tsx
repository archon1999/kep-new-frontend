import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tournament, TournamentDuel, TournamentDuelPlayer, TournamentStage } from '../../domain/entities/tournament.entity';

interface TournamentDuelsSectionProps {
  tournament: Tournament;
}

const getPlayerColor = (duel: TournamentDuel, player: TournamentDuelPlayer | null | undefined) => {
  if (!player) return 'text.disabled';
  if (duel.status !== 1 || player.status == null) return 'text.primary';
  if (player.status > 0) return 'primary.main';
  if (player.status < 0) return 'text.disabled';
  return 'warning.main';
};

const TournamentDuelsSection = ({ tournament }: TournamentDuelsSectionProps) => {
  const { t } = useTranslation();
  const stages = (tournament.stages ?? []).sort((a, b) => a.number - b.number);

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {t('tournaments.duels')}
        </Typography>

        {stages.map((stage: TournamentStage) => (
          <Stack key={stage.number} direction="column" spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={800}>
                {stage.title || t('tournaments.stageTitle', { number: stage.number })}
              </Typography>
              {stage.startTime ? <Chip label={stage.startTime} size="small" variant="outlined" /> : null}
            </Stack>

            <Stack direction="column" spacing={1}>
              {stage.duels.map((stageDuel) => {
                const duel = stageDuel.duel;
                return (
                  <Card key={`${stage.number}-${stageDuel.number}`} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2" fontWeight={800}>
                            {t('tournaments.matchLabel', { number: stageDuel.number })}
                          </Typography>
                          {duel.presetTitle ? (
                            <Chip size="small" label={duel.presetTitle} variant="outlined" />
                          ) : null}
                        </Stack>
                        {duel.status === 1 ? (
                          <Chip label={t('tournaments.finished')} size="small" color="success" />
                        ) : (
                          <Chip label={t('tournaments.upcoming')} size="small" variant="outlined" />
                        )}
                      </Stack>

                      <Stack direction="column" spacing={1}>
                        {[duel.playerFirst, duel.playerSecond].map((player, index) => (
                          <Stack
                            key={player?.id ?? index}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography
                                fontWeight={800}
                                color={getPlayerColor(duel, player)}
                                sx={{ minWidth: 20 }}
                              >
                                {player ? player.username : t('tournaments.waitingPlayer')}
                              </Typography>
                              <Chip label={player?.ratingTitle ?? '—'} size="small" variant="outlined" />
                            </Stack>
                            <Typography fontWeight={800} color={getPlayerColor(duel, player)}>
                              {player?.balls ?? '—'}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}

              {stage.duels.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('tournaments.noDuels')}
                </Typography>
              ) : null}
            </Stack>

            <Divider />
          </Stack>
        ))}

        {stages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.noStages')}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TournamentDuelsSection;
