import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDuelsRating } from '../../application/queries.ts';

const DuelsRatingPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDuelsRating({ page, pageSize: 20 });

  const rows = data?.data ?? [];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('duels.rating')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.ratingSubtitle')}
          </Typography>
        </Stack>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('duels.position')}</TableCell>
                <TableCell>{t('duels.player')}</TableCell>
                <TableCell align="right">{t('duels.duelsPlayed')}</TableCell>
                <TableCell align="right">{t('duels.wins')}</TableCell>
                <TableCell align="right">{t('duels.draws')}</TableCell>
                <TableCell align="right">{t('duels.losses')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t('common.loading')}...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                : rows.map((row, index) => (
                    <TableRow key={row.user.username} hover>
                      <TableCell>{row.rowIndex ?? (page - 1) * (data?.pageSize ?? 0) + index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar src={row.user.avatar}>{row.user.username[0]}</Avatar>
                          <Typography fontWeight={700}>{row.user.username}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{row.duels}</TableCell>
                      <TableCell align="right">{row.wins}</TableCell>
                      <TableCell align="right">{row.draws}</TableCell>
                      <TableCell align="right">{row.losses}</TableCell>
                    </TableRow>
                  ))}

              {!isLoading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('duels.noRating')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Box>

        {data?.pagesCount && data.pagesCount > 1 ? (
          <Stack direction="row" justifyContent="center">
            <Pagination color="warning" count={data.pagesCount} page={page} onChange={(_, value) => setPage(value)} />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default DuelsRatingPage;
