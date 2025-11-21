import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import TournamentBracket from '../components/TournamentBracket';
import TournamentInfoCard from '../components/TournamentInfoCard';
import { useTournamentDetails } from '../../application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

const TournamentPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: tournament, isLoading } = useTournamentDetails(id);

  const headerTitle = useMemo(() => tournament?.title ?? t('tournaments.title'), [t, tournament?.title]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconifyIcon icon="mdi:medal-outline" color="warning.main" fontSize={28} />
          <Typography variant="h4" fontWeight={800}>
            {headerTitle}
          </Typography>
        </Stack>

        {isLoading || !tournament ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={220} />
            <Skeleton variant="rounded" height={420} />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TournamentInfoCard tournament={tournament} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TournamentBracket tournament={tournament} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentPage;
