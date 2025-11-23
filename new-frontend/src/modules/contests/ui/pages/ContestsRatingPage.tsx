import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestsRating } from '../../application/queries';

const orderingOptions = [
  { key: 'rating', label: 'contests.rating.ordering.rating' },
  { key: 'max_rating', label: 'contests.rating.ordering.maxRating' },
  { key: 'contestants_count', label: 'contests.rating.ordering.contests' },
] as const;

const ContestsRatingPage = () => {
  const { t } = useTranslation();
  const [ordering, setOrdering] = useState('-rating');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: ratingPage, isLoading } = useContestsRating({ page, pageSize, ordering });

  const orderingState = useMemo(() => {
    const key = ordering.replace('-', '');
    const isDescending = ordering.startsWith('-');
    return { key, isDescending };
  }, [ordering]);

  const handleOrderingChange = (key: string) => {
    setPage(1);
    setOrdering((prev) => {
      const currentKey = prev.replace('-', '');
      const isDescending = prev.startsWith('-');

      if (currentKey === key) {
        return isDescending ? key : `-${key}`;
      }

      return `-${key}`;
    });
  };

  const rows = ratingPage?.data ?? [];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
        >
          <Stack spacing={0.75} direction="column">
            <Typography variant="h4" fontWeight={800}>
              {t('contests.rating.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('contests.rating.subtitle')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
            {orderingOptions.map((option) => {
              const active = orderingState.key === option.key;
              const icon = active ? (
                <IconifyIcon
                  icon={orderingState.isDescending ? 'mdi:arrow-down' : 'mdi:arrow-up'}
                  sx={{ fontSize: 18 }}
                />
              ) : undefined;

              return (
                <Button
                  key={option.key}
                  variant={active ? 'contained' : 'outlined'}
                  color={active ? 'primary' : 'neutral'}
                  size="small"
                  onClick={() => handleOrderingChange(option.key)}
                  endIcon={icon}
                >
                  {t(option.label)}
                </Button>
              );
            })}
          </Stack>
        </Stack>

        <Card variant="outlined">
          {isLoading ? <LinearProgress /> : null}
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('contests.rating.total', { count: ratingPage?.total ?? 0 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('contests.rating.pageInfo', {
                  page: ratingPage?.page ?? 1,
                  pages: ratingPage?.pagesCount ?? 1,
                })}
              </Typography>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('contests.rating.columns.place')}</TableCell>
                  <TableCell>{t('contests.rating.columns.user')}</TableCell>
                  <TableCell>{t('contests.rating.columns.rating')}</TableCell>
                  <TableCell>{t('contests.rating.columns.maxRating')}</TableCell>
                  <TableCell align="right">{t('contests.rating.columns.contests')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.username} hover>
                    <TableCell width={72}>{row.rowIndex}</TableCell>
                    <TableCell>
                      <UserPopover username={row.username}>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          sx={{ textDecoration: 'none', color: 'text.primary' }}
                        >
                          {row.username}
                        </Typography>
                      </UserPopover>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <ContestsRatingChip title={row.ratingTitle} imgSize={28} />
                        <Stack direction="row" spacing={0.25}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {row.rating ?? '—'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {row.ratingTitle}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <ContestsRatingChip
                          title={row.maxRatingTitle ?? row.ratingTitle}
                          imgSize={24}
                        />
                        <Stack direction="row" spacing={0.25}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {row.maxRating ?? '—'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {row.maxRatingTitle ?? '—'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <IconifyIcon
                          icon="mdi:podium"
                          sx={{ fontSize: 18, color: 'text.secondary' }}
                        />
                        <Typography variant="subtitle2" fontWeight={700}>
                          {row.contestantsCount}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && !isLoading && (
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
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Pagination
                count={ratingPage?.pagesCount ?? 0}
                page={page}
                color="primary"
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ContestsRatingPage;
