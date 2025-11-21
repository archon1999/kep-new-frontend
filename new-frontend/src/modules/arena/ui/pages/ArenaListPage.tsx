import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useArenasList } from '../../application/queries.ts';
import ArenaListCard from '../components/ArenaListCard.tsx';

const ArenaListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArenasList({
    page,
    pageSize: 6,
    status: undefined,
  });

  const arenas = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  const subtitle = useMemo(
    () =>
      arenas.length
        ? t('arena.listSubtitle', { count: data?.total ?? arenas.length })
        : t('arena.listEmptySubtitle'),
    [arenas.length, data?.total, t],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('arena.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>

        {isLoading
          ? Array.from({ length: 6 }).map((_) => <Skeleton variant="rounded" height={200} />)
          : arenas.map((arena) => <ArenaListCard arena={arena} />)}

        {!isLoading && arenas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('arena.listEmptySubtitle')}
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

export default ArenaListPage;
