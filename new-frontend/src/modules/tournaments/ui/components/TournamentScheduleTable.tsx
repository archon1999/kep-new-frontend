import { useTranslation } from 'react-i18next';
import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TournamentStage } from '../../domain/entities/tournament.entity.ts';

interface TournamentScheduleTableProps {
  stages: TournamentStage[];
}

const TournamentScheduleTable = ({ stages }: TournamentScheduleTableProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="subtitle2">{t('tournaments.round')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">{t('tournaments.schedule')}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stages.map((stage) => (
              <TableRow key={stage.number} hover>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {stage.title || t('tournaments.stageNumber', { number: stage.number })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {stage.startTime ? (
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(stage.startTime).format('DD-MM-YYYY HH:mm')}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('tournaments.scheduleTbd')}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TournamentScheduleTable;
