import { useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Pagination, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDuelsRating } from '../../application/queries.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const DuelsRatingPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: rating } = useDuelsRating({ page, pageSize, ordering: '-wins' });

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('duels.ratingTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.ratingSubtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {(rating?.data ?? []).map((row) => (
            <Grid item xs={12} sm={6} md={4} key={row.user.username}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2} direction="column">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h5" color="primary">
                        {row.rowIndex}
                      </Typography>
                      <Avatar src={row.user.avatar}>{row.user.username[0]}</Avatar>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1">{row.user.username}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('duels.totalDuels', { count: row.duels ?? 0 })}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography color="success.main" variant="body2">
                        {t('duels.winsShort', { count: row.wins ?? 0 })}
                      </Typography>
                      <Typography color="info.main" variant="body2">
                        {t('duels.drawsShort', { count: row.draws ?? 0 })}
                      </Typography>
                      <Typography color="error.main" variant="body2">
                        {t('duels.lossesShort', { count: row.losses ?? 0 })}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!rating?.data?.length && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {t('duels.noRating')}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box display="flex" justifyContent="flex-end">
          <Pagination
            count={rating?.pagesCount ?? 0}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default DuelsRatingPage;
