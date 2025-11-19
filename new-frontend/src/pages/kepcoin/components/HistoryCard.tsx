import { Alert, Card, CardContent, CardHeader, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HistoryTimeline from './HistoryTimeline';
import type {
  KepcoinEarn,
  KepcoinHistoryPage,
  KepcoinSpend,
} from 'modules/kepcoin/domain/entities/kepcoin-history.entity';

interface HistoryCardProps {
  view: 'earns' | 'spends';
  onToggle: () => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  earns?: KepcoinHistoryPage<KepcoinEarn>;
  spends?: KepcoinHistoryPage<KepcoinSpend>;
  loading: boolean;
  error?: Error;
}

const HistoryCard = ({
  view,
  onToggle,
  page,
  pageSize,
  onPageChange,
  earns,
  spends,
  loading,
  error,
}: HistoryCardProps) => {
  const { t } = useTranslation();

  const isEarns = view === 'earns';
  const activeData = isEarns ? earns : spends;
  const totalPages = activeData ? Math.ceil((activeData.total || 0) / pageSize) : 0;
  const items = activeData?.items ?? [];

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {isEarns ? t('kepcoin.history.earnsTitle') : t('kepcoin.history.spendsTitle')}
          </Typography>
        }
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {isEarns ? t('kepcoin.history.toggleSpends') : t('kepcoin.history.toggleEarns')}
            </Typography>
            <Typography
              component="button"
              onClick={() => {
                onToggle();
              }}
              sx={{
                border: 'none',
                background: 'none',
                color: 'primary.main',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isEarns ? t('kepcoin.history.showSpends') : t('kepcoin.history.showEarns')}
            </Typography>
          </Stack>
        }
      />

      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t('kepcoin.history.loadError')}
          </Alert>
        )}

        {loading ? (
          <Stack spacing={2}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} variant="rounded" height={64} />
            ))}
          </Stack>
        ) : items.length ? (
          <Stack spacing={2}>
            {view === 'earns' ? (
              <HistoryTimeline type="earns" items={items as KepcoinEarn[]} />
            ) : (
              <HistoryTimeline type="spends" items={items as KepcoinSpend[]} />
            )}
            {totalPages > 1 && (
              <Stack direction="row" justifyContent="center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => onPageChange(value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {isEarns ? t('kepcoin.history.emptyEarns') : t('kepcoin.history.emptySpends')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
