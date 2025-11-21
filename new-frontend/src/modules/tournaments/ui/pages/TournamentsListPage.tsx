import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useTournamentsList } from '../../application/queries';
import TournamentListCard from '../components/TournamentListCard';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTournamentsList({ page, pageSize: 6 });

  const tournaments = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  const subtitle = useMemo(
    () =>
      tournaments.length
        ? t('tournaments.listSubtitle', { count: data?.total ?? tournaments.length })
        : t('tournaments.listEmptySubtitle'),
    [t, tournaments.length, data?.total],
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('tournaments.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>

        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} variant="rounded" height={140} />)
          : tournaments.map((tournament) => <TournamentListCard key={tournament.id} tournament={tournament} />)}

        {!isLoading && tournaments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.listEmptySubtitle')}
          </Typography>
        ) : null}

        {pagesCount > 1 ? (
          <Stack direction="column" alignItems="center">
            <Pagination
              color="warning"
              count={pagesCount}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default TournamentsListPage;
