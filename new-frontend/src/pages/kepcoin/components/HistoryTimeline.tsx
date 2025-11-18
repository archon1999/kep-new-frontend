import { ReactNode } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import KepcoinValue from './KepcoinValue';

export interface HistoryItem {
  id: string;
  amount: number;
  date?: string;
  description: string;
  note?: string;
  media?: ReactNode;
}

interface HistoryTimelineProps {
  items: HistoryItem[];
  isLoading?: boolean;
  emptyLabel: string;
}

const HistorySkeleton = () => (
  <Stack spacing={2} sx={{ position: 'relative', pl: 3 }}>
    <Box
      sx={{
        position: 'absolute',
        left: 8,
        top: 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: 'warning.main',
        transform: 'translateX(-50%)',
      }}
    />
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Skeleton variant="rounded" width={96} height={24} />
      <Skeleton variant="text" width={120} />
    </Stack>
    <Skeleton variant="text" width="90%" />
  </Stack>
);

const HistoryTimeline = ({ items, isLoading, emptyLabel }: HistoryTimelineProps) => {
  if (isLoading) {
    return (
      <Stack spacing={3} divider={<Box sx={{ height: 12 }} />}> 
        {Array.from({ length: 3 }).map((_, idx) => (
          <HistorySkeleton key={idx} />
        ))}
      </Stack>
    );
  }

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      {items.map((item, index) => (
        <Stack key={item.id} spacing={1.25} sx={{ position: 'relative', pl: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 8,
              top: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              transform: 'translateX(-50%)',
            }}
          />
          {index < items.length - 1 && (
            <Box
              sx={{
                position: 'absolute',
                left: 8,
                top: 16,
                bottom: -24,
                width: 2,
                bgcolor: 'divider',
                transform: 'translateX(-50%)',
              }}
            />
          )}

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <KepcoinValue value={item.amount} />
            {item.date && (
              <Typography variant="caption" color="text.secondary">
                {dayjs(item.date).format('YYYY-MM-DD HH:mm')}
              </Typography>
            )}
          </Stack>

          <Typography variant="body2" color="text.primary">
            {item.description}
          </Typography>

          {item.note && (
            <Typography variant="caption" color="text.secondary">
              {item.note}
            </Typography>
          )}

          {item.media}
        </Stack>
      ))}
    </Stack>
  );
};

export default HistoryTimeline;
