import { Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageLoader from 'shared/components/loading/PageLoader';
import HackathonTabs from '../components/HackathonTabs';
import { useHackathon, useHackathonRegistrants } from '../../application/queries';

const HackathonRegistrantsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: hackathon, isLoading: isLoadingHackathon } = useHackathon(id);
  const { data: registrants, isLoading } = useHackathonRegistrants(id);

  if (isLoadingHackathon || !hackathon) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>
            {t('hackathons.registrantsTitle', { title: hackathon.title })}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('hackathons.contestant')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(registrants ?? []).map((registrant, idx) => (
                <TableRow key={`${registrant.username}-${idx}`}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {registrant.userAvatar ? (
                        <Box
                          component="img"
                          src={registrant.userAvatar}
                          alt={registrant.username}
                          sx={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                      ) : null}
                      <Stack spacing={0.25}>
                        <Typography fontWeight={700}>{registrant.username}</Typography>
                        {registrant.userFullName ? (
                          <Typography variant="caption" color="text.secondary">
                            {registrant.userFullName}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2}>{t('hackathons.loading')}</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HackathonRegistrantsPage;
