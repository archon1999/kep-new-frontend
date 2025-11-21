import { Box, FormControlLabel, Pagination, Paper, Stack, Switch, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import PageLoader from 'shared/components/loading/PageLoader';
import HackathonTabs from '../components/HackathonTabs';
import { useHackathon, useHackathonAttempts } from '../../application/queries';
import ProjectAttemptsTable from '../../projects/ui/components/ProjectAttemptsTable';

const HackathonAttemptsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [showMine, setShowMine] = useState(!!currentUser);

  useEffect(() => {
    if (!currentUser) {
      setShowMine(false);
    }
  }, [currentUser]);

  const { data: hackathon, isLoading: isLoadingHackathon } = useHackathon(id);
  const { data, isLoading, mutate } = useHackathonAttempts(id, {
    page,
    username: showMine ? currentUser?.username : undefined,
  });

  if (isLoadingHackathon || !hackathon) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={800}>
          {t('hackathons.attemptsTitle', { title: hackathon.title })}
        </Typography>
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('hackathons.tabs.attempts')}
            </Typography>
            <FormControlLabel
              control={<Switch checked={showMine} onChange={() => setShowMine((prev) => !prev)} disabled={!currentUser} />}
              label={t('projects.myAttempts')}
            />
          </Stack>
          <ProjectAttemptsTable
            attempts={data?.data}
            isLoading={isLoading}
            onRerun={() => mutate()}
          />
        </Paper>
        <Box display="flex" justifyContent="flex-end">
          <Pagination
            shape="rounded"
            count={data?.pagesCount ?? 0}
            page={page}
            color="primary"
            onChange={(_, value) => setPage(value)}
            disabled={!data}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default HackathonAttemptsPage;
