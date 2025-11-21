import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, Pagination, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useArenasList } from '../../application/queries.ts';
import ArenaListCard from '../components/ArenaListCard.tsx';

const ArenaListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useArenasList({
    page,
    pageSize: 6,
    title: debouncedSearch || undefined,
    status: undefined,
  });

  const arenas = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const subtitle = useMemo(
    () =>
      arenas.length
        ? t('arena.listSubtitle', { count: data?.total ?? arenas.length })
        : t('arena.listEmptySubtitle'),
    [arenas.length, data?.total, t],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('arena.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>

        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder={t('arena.searchPlaceholder')}
          fullWidth
        />

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))
            : arenas.map((arena) => (
                <Grid key={arena.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <ArenaListCard arena={arena} />
                </Grid>
              ))}
        </Grid>

        {!isLoading && arenas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('arena.listEmptySubtitle')}
          </Typography>
        ) : null}

        {pagesCount > 1 ? (
          <Stack alignItems="center">
            <Pagination color="warning" count={pagesCount} page={page} onChange={(_, value) => setPage(value)} />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ArenaListPage;
