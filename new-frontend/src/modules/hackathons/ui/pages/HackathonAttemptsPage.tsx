import { useState } from 'react';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHackathon } from '../../application/queries';
import HackathonTabs from '../components/HackathonTabs';
import { useProjectAttempts } from 'modules/projects/application/queries';
import HackathonAttemptsTable from '../components/HackathonAttemptsTable';

const HackathonAttemptsPage = () => {
  const { id } = useParams();
  const hackathonId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: hackathon } = useHackathon(id);
  const { data, isLoading } = useProjectAttempts(undefined, { page, hackathonId });

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800}>
            {t('hackathons.attempts')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.total ?? 0} {t('projects.attempts')}
          </Typography>
        </Stack>

        <HackathonAttemptsTable attempts={data?.data} isLoading={isLoading} />

        <Box display="flex" justifyContent="flex-end">
          <Pagination
            shape="rounded"
            count={data?.pagesCount ?? 0}
            page={page}
            onChange={(_, value) => setPage(value)}
            disabled={!data}
            color="primary"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default HackathonAttemptsPage;
