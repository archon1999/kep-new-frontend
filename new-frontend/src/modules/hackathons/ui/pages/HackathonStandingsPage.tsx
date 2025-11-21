import { Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageLoader from 'shared/components/loading/PageLoader';
import HackathonTabs from '../components/HackathonTabs';
import { useHackathon, useHackathonProjects, useHackathonStandings } from '../../application/queries';

const HackathonStandingsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: hackathon, isLoading: isLoadingHackathon } = useHackathon(id);
  const { data: standings, isLoading } = useHackathonStandings(id);
  const { data: projects } = useHackathonProjects(id);

  if (isLoadingHackathon || !hackathon) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>
            {t('hackathons.standingsTitle', { title: hackathon.title })}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('hackathons.contestant')}</TableCell>
                <TableCell>{t('hackathons.points')}</TableCell>
                {projects?.map((project) => (
                  <TableCell key={project.symbol} align="center">
                    {project.symbol}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(standings ?? []).map((participant, idx) => (
                <TableRow key={`${participant.username}-${idx}`}>
                  <TableCell>{participant.rank ?? idx + 1}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {participant.userAvatar ? (
                        <Box
                          component="img"
                          src={participant.userAvatar}
                          alt={participant.username}
                          sx={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                      ) : null}
                      <Stack spacing={0.25}>
                        <Typography fontWeight={700}>{participant.username}</Typography>
                        {participant.userFullName ? (
                          <Typography variant="caption" color="text.secondary">
                            {participant.userFullName}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={800} color="primary">
                      {participant.points}
                    </Typography>
                  </TableCell>
                  {projects?.map((project) => {
                    const result = participant.projectResults?.find((item) => item.symbol === project.symbol);
                    return (
                      <TableCell key={project.symbol} align="center">
                        {result ? (
                          <Stack spacing={0.25} alignItems="center">
                            <Typography fontWeight={700}>{result.points}</Typography>
                            {result.hackathonTime ? (
                              <Typography variant="caption" color="text.secondary">
                                {result.hackathonTime.slice(0, 5)}
                              </Typography>
                            ) : null}
                          </Stack>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={(projects?.length ?? 0) + 3}>{t('hackathons.loading')}</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HackathonStandingsPage;
