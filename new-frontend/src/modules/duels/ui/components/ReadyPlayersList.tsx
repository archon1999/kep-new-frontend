import { useTranslation } from 'react-i18next';
import { Avatar, Card, CardContent, Pagination, Stack, Typography } from '@mui/material';
import { DuelReadyPlayer } from '../../domain/entities/duel.entity.ts';
import { PageResult } from '../../domain/ports/duels.repository.ts';

interface ReadyPlayersListProps {
  players?: PageResult<DuelReadyPlayer> | null;
  page: number;
  onPageChange: (page: number) => void;
}

const ReadyPlayersList = ({ players, page, onPageChange }: ReadyPlayersListProps) => {
  const { t } = useTranslation();

  const list = players?.data ?? [];
  const pagesCount = players?.pagesCount ?? 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('duels.readyPlayers')}
          </Typography>

          <Stack spacing={1.5}>
            {list.map((player) => (
              <Stack
                key={player.username}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={player.avatar}>{player.username[0]}</Avatar>
                  <Stack spacing={0.25}>
                    <Typography fontWeight={700}>{player.fullName || player.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {player.username}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" color="success.main">
                    {t('duels.wins')}: {player.wins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('duels.draws')}: {player.draws}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    {t('duels.losses')}: {player.losses}
                  </Typography>
                </Stack>
              </Stack>
            ))}

            {list.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('duels.noReadyPlayers')}
              </Typography>
            ) : null}
          </Stack>

          {pagesCount > 1 ? (
            <Stack direction="row" justifyContent="center">
              <Pagination
                color="warning"
                count={pagesCount}
                page={page}
                onChange={(_, value) => onPageChange(value)}
              />
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReadyPlayersList;
