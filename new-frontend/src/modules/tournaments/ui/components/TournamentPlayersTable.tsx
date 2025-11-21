import { useTranslation } from 'react-i18next';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { TournamentDuelPlayer } from '../../domain/entities/tournament.entity';

interface Props {
  players: TournamentDuelPlayer[];
}

const TournamentPlayersTable = ({ players }: Props) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: (theme) => theme.palette.primary.main }}>
            <TableCell sx={{ color: 'common.white', width: 80 }}>#</TableCell>
            <TableCell sx={{ color: 'common.white' }}>{t('tournaments.user')}</TableCell>
            <TableCell sx={{ color: 'common.white', width: 200 }}>{t('tournaments.ratingTitle')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, idx) => (
            <TableRow key={player.id}>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {idx + 1}
                </Typography>
              </TableCell>
              <TableCell>{player.username}</TableCell>
              <TableCell>{player.ratingTitle}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TournamentPlayersTable;
