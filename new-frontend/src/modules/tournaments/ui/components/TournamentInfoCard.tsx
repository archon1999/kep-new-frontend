import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tournament } from '../../domain/entities/tournament.entity';

interface TournamentInfoCardProps {
  tournament: Tournament;
}

const TournamentInfoCard = ({ tournament }: TournamentInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h6" fontWeight={800}>
            {t('tournaments.about')}
          </Typography>
          {tournament.description ? (
            <Typography
              variant="body1"
              color="text.secondary"
              component="div"
              sx={{ '& p': { m: 0 } }}
              dangerouslySetInnerHTML={{ __html: tournament.description }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.noDescription')}
            </Typography>
          )}
        </Stack>

        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" fontWeight={800}>
              {t('tournaments.participants')} ({tournament.players?.length ?? 0})
            </Typography>
          </Stack>

          <Stack direction="column" spacing={1}>
            {(tournament.players ?? []).map((player) => (
              <Stack
                key={player.id}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {player.username.charAt(0).toUpperCase()}
                  </Box>
                  <Stack direction="column" spacing={0.25}>
                    <Typography fontWeight={700}>{player.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {player.ratingTitle}
                    </Typography>
                  </Stack>
                </Stack>
                <Chip label={t('tournaments.playerBadge', { rank: player.ratingTitle })} size="small" />
              </Stack>
            ))}

            {(tournament.players ?? []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.noPlayers')}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentInfoCard;
