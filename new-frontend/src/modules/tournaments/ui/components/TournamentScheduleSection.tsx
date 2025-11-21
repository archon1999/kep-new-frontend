import { Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tournament } from '../../domain/entities/tournament.entity';

interface TournamentScheduleSectionProps {
  tournament: Tournament;
}

const TournamentScheduleSection = ({ tournament }: TournamentScheduleSectionProps) => {
  const { t } = useTranslation();
  const stages = (tournament.stages ?? []).sort((a, b) => a.number - b.number);

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('tournaments.schedule')}
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('tournaments.stage')}</TableCell>
                <TableCell>{t('tournaments.start')}</TableCell>
                <TableCell align="right">{t('tournaments.matches')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage.number}>
                  <TableCell>{stage.title || t('tournaments.stageTitle', { number: stage.number })}</TableCell>
                  <TableCell>{stage.startTime ?? '—'}</TableCell>
                  <TableCell align="right">{stage.duels.length}</TableCell>
                </TableRow>
              ))}

              {stages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('tournaments.noSchedule')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentScheduleSection;
