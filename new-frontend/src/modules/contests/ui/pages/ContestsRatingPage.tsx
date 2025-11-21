import { useState } from 'react';
import { Box, Card, CardContent, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestsRating } from '../../application/queries';

const DEFAULT_PAGE_SIZE = 12;

const orderingOptions = ['rating', 'max_rating', 'contestants_count'] as const;

type OrderingKey = (typeof orderingOptions)[number];

const ContestsRatingPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [ordering, setOrdering] = useState<string>('-rating');

  const { data: ratingPage } = useContestsRating({ page, pageSize, ordering });
  const rows = ratingPage?.data ?? [];

  const toggleOrdering = (key: OrderingKey) => {
    setPage(1);
    setOrdering((prev) => {
      if (prev === key) return `-${key}`;
      if (prev === `-${key}`) return key;
      return `-${key}`;
    });
  };

  const isOrderingActive = (key: OrderingKey) => ordering === key || ordering === `-${key}`;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={0.5} direction="column">
          <Typography variant="h4" fontWeight={800} textTransform="capitalize">
            {t('contests.rating.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('contests.rating.subtitle')}
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
          {orderingOptions.map((key) => (
            <Button
              key={key}
              variant={isOrderingActive(key) ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => toggleOrdering(key)}
              endIcon={
                isOrderingActive(key) ? (
                  <KepIcon name={ordering.startsWith('-') ? 'arrow-down' : 'arrow-up'} fontSize={16} />
                ) : undefined
              }
              sx={{ textTransform: 'none' }}
            >
              {t(`contests.rating.ordering.${key}`)}
            </Button>
          ))}
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('contests.rating.table.place')}</TableCell>
                  <TableCell>{t('contests.rating.table.user')}</TableCell>
                  <TableCell>{t('contests.rating.table.rating')}</TableCell>
                  <TableCell>{t('contests.rating.table.maxRating')}</TableCell>
                  <TableCell align="right">{t('contests.rating.table.contests')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.username}>
                    <TableCell>{row.rowIndex}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                        {row.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ContestsRatingChip title={row.ratingTitle} imgSize={24} />
                        <Typography variant="body2" fontWeight={700}>
                          {row.rating}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ContestsRatingChip title={row.maxRatingTitle} imgSize={24} />
                        <Typography variant="body2" fontWeight={700}>
                          {row.maxRating}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{row.contestantsCount}</TableCell>
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        {t('contests.rating.empty')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination
                count={ratingPage?.pagesCount ?? 0}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ContestsRatingPage;
