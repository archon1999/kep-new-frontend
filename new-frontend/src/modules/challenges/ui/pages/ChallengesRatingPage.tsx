import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChallengesRating } from '../../application/queries.ts';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const { data: ratingPage } = useChallengesRating({ page, pageSize, ordering: '-rating' });

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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('challenges.table.place')}</TableCell>
                  <TableCell>{t('challenges.table.username')}</TableCell>
                  <TableCell>{t('challenges.table.rank')}</TableCell>
                  <TableCell>{t('challenges.table.rating')}</TableCell>
                  <TableCell align="right">{t('challenges.table.record')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(ratingPage?.data ?? []).map((row) => (
                  <TableRow key={row.username}>
                    <TableCell>{row.rowIndex}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>
                      <ChallengesRatingChip title={row.rankTitle} size="small" />
                    </TableCell>
                    <TableCell>{row.rating}</TableCell>
                    <TableCell align="right">
                      {t('challenges.record', { wins: row.wins, draws: row.draws, losses: row.losses })}
                    </TableCell>
                  </TableRow>
                ))}
                {!ratingPage?.data?.length && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        {t('challenges.noRating')}
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

export default ChallengesRatingPage;
