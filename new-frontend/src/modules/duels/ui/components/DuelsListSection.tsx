import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { PageResult } from '../../domain/ports/duels.repository.ts';
import { Duel } from '../../domain/entities/duel.entity.ts';
import DuelsListCard from './DuelsListCard.tsx';

interface DuelsListSectionProps {
  titleKey: string;
  duels?: PageResult<Duel> | null;
  loading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onConfirm?: (duelId: number) => void;
  confirmLoadingId?: number | null;
}

const DuelsListSection = ({
  titleKey,
  duels,
  loading,
  page,
  onPageChange,
  onConfirm,
  confirmLoadingId,
}: DuelsListSectionProps) => {
  const { t } = useTranslation();

  const duelsList = duels?.data ?? [];
  const pagesCount = duels?.pagesCount ?? 0;

  const emptyLabel = useMemo(() => t('duels.noDuels'), [t]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={700} textTransform="capitalize">
        {t(titleKey)}
      </Typography>

      <Stack spacing={2}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rounded" height={140} />)
          : duelsList.map((duel) => (
              <DuelsListCard
                key={duel.id}
                duel={duel}
                onConfirm={onConfirm}
                confirmDisabled={Boolean(confirmLoadingId && confirmLoadingId !== duel.id)}
                confirmLoading={confirmLoadingId === duel.id}
              />
            ))}

        {!loading && duelsList.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyLabel}
          </Typography>
        ) : null}
      </Stack>

      {pagesCount > 1 ? (
        <Stack direction="row" justifyContent="center">
          <Pagination
            color="warning"
            count={pagesCount}
            page={page}
            onChange={(_, value) => onPageChange(value)}
          />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default DuelsListSection;
