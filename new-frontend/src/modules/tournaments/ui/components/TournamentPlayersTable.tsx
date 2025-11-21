import { useTranslation } from 'react-i18next';
import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { TournamentPlayer } from '../../domain/entities/tournament.entity.ts';

interface TournamentPlayersTableProps {
  players: TournamentPlayer[];
}

const TournamentPlayersTable = ({ players }: TournamentPlayersTableProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={800} gutterBottom>
          {t('tournaments.players')}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('tournaments.user')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={player.id} hover>
                <TableCell width={72}>{index + 1}</TableCell>
                <TableCell>
                  <UserPopover username={player.username}>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {player.username}
                    </Typography>
                  </UserPopover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TournamentPlayersTable;
