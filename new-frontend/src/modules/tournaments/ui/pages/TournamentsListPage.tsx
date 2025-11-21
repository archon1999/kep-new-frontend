import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useTournamentsList } from '../../application/queries';
import TournamentCard from '../components/TournamentCard';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTournamentsList({ page, pageSize: 6 });
  const tournaments = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('menu.tournaments')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tournaments.length
              ? t('tournaments.subtitle', { count: data?.total ?? tournaments.length })
              : t('tournaments.empty')}
          </Typography>
        </Stack>

        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} variant="rounded" height={140} />)
          : tournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}

        {!isLoading && tournaments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.empty')}
          </Typography>
        ) : null}

        {pagesCount > 1 ? (
          <Stack direction="row" justifyContent="center">
            <Pagination color="primary" count={pagesCount} page={page} onChange={(_, value) => setPage(value)} />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default TournamentsListPage;
