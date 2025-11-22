import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Pagination,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useChallengesRating } from '../../application/queries.ts';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [ordering, setOrdering] = useState('-rating');

  const { data: ratingPage, isLoading } = useChallengesRating({ page, pageSize, ordering });

  const handleOrderingChange = (_: unknown, value: string) => {
    if (!value) return;
    setOrdering(value);
    setPage(1);
  };

  const rows = ratingPage?.data ?? [];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={0.5} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('challenges.ratingTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.ratingSubtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
              <ToggleButtonGroup
                value={ordering}
                exclusive
                size="small"
                onChange={handleOrderingChange}
                aria-label="ordering"
              >
                <ToggleButton value="-rating">{t('challenges.table.rating')}</ToggleButton>
                <ToggleButton value="-wins">{t('common.wins', { defaultValue: 'Wins' })}</ToggleButton>
                <ToggleButton value="-draws">{t('common.draws', { defaultValue: 'Draws' })}</ToggleButton>
                <ToggleButton value="-losses">{t('common.losses', { defaultValue: 'Losses' })}</ToggleButton>
              </ToggleButtonGroup>
              {ratingPage?.total ? (
                <Typography variant="caption" color="text.secondary">
                  {t('challenges.totalPlayers', { count: ratingPage.total })}
                </Typography>
              ) : null}
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                    </Grid>
                  ))
                : rows.map((row) => (
                    <Grid size={{ xs: 12, md: 6 }} key={row.username}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Stack spacing={1.25} direction="column">
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Chip label={`#${row.rowIndex}`} size="small" color="primary" />
                              <ChallengesRatingChip title={row.rankTitle} size="small" />
                            </Stack>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {row.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t('challenges.record', { wins: row.wins, draws: row.draws, losses: row.losses })}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Typography variant="h6" fontWeight={800}>
                                {row.rating}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip label={`W ${row.wins}`} color="success" size="small" variant="soft" />
                                <Chip label={`D ${row.draws}`} color="warning" size="small" variant="soft" />
                                <Chip label={`L ${row.losses}`} color="error" size="small" variant="soft" />
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Button variant="outlined" size="small" onClick={() => setOrdering('-rating')}>
                {t('challenges.openRating')}
              </Button>
              <Pagination
                count={ratingPage?.pagesCount ?? 0}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ChallengesRatingPage;
