import { useState } from 'react';
import { Alert, Pagination, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DEFAULT_CHALLENGES_PAGE_SIZE, useChallengesList } from '../../application/queries';
import ChallengeCard from './ChallengeCard';
import ChallengeCardSkeleton from './ChallengeCardSkeleton';

const ChallengesListContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useChallengesList({ page, pageSize: DEFAULT_CHALLENGES_PAGE_SIZE });

  const challenges = data?.data ?? [];
  const totalPages = data?.pagesCount ?? 0;
  const total = data?.total ?? 0;

  const handlePageChange = (_: unknown, value: number) => setPage(value);

  const showEmpty = !isLoading && challenges.length === 0 && !error;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          {t('challenges.listTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('challenges.listSubtitle')}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <ChallengeCardSkeleton key={index} />)
          : challenges.map((challenge) => <ChallengeCard key={challenge.id ?? `challenge-${challenge.playerFirst.username}-${challenge.playerSecond.username}`} challenge={challenge} />)}
      </Stack>

      {error && <Alert severity="error">{t('challenges.error')}</Alert>}

      {showEmpty && <Alert severity="info">{t('challenges.empty')}</Alert>}

      {(totalPages > 1 || total > 0) && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.paginationLabel', { total })}
          </Typography>
          <Pagination
            count={Math.max(totalPages, 1)}
            page={Math.min(page, Math.max(totalPages, 1))}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
};

export default ChallengesListContainer;
