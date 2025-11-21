import { Card, CardContent, Chip, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaChallenge } from '../../domain/entities/arena-challenge.entity.ts';
import { PageResult } from '../../domain/ports/arena.repository.ts';

interface ArenaChallengesListProps {
  data?: PageResult<ArenaChallenge>;
  loading?: boolean;
}

const ArenaChallengesList = ({ data, loading }: ArenaChallengesListProps) => {
  const { t } = useTranslation();

  const challenges = data?.data ?? [];

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        {t('arena.challenges')}
      </Typography>
      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rounded" height={120} />
              </Grid>
            ))
          : challenges.map((challenge) => (
              <Grid key={challenge.id} size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    {[challenge.playerFirst, challenge.playerSecond].map((player, index) => (
                      <Stack
                        key={`${challenge.id}-${player.username}-${index}`}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ py: 0.5 }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <IconifyIcon icon="mdi:account-circle" fontSize={28} color="warning.main" />
                          <Stack spacing={0.25}>
                            <Typography fontWeight={700}>{player.username}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {player.rankTitle} · {player.rating}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Chip
                          color={
                            index === 0
                              ? player.result > challenge.playerSecond.result
                                ? 'success'
                                : player.result < challenge.playerSecond.result
                                  ? 'error'
                                  : 'default'
                              : player.result > challenge.playerFirst.result
                                ? 'success'
                                : player.result < challenge.playerFirst.result
                                  ? 'error'
                                  : 'default'
                          }
                          label={player.result}
                        />
                      </Stack>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
      {!loading && challenges.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('arena.noChallenges')}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
};

export default ArenaChallengesList;
