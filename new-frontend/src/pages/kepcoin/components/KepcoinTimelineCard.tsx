import { ReactNode } from 'react';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from './KepcoinValue';

export interface KepcoinTimelineItem {
  id: string | number;
  amount: string | number;
  dateLabel: string;
  description: ReactNode;
  media?: ReactNode;
}

interface KepcoinTimelineCardProps {
  title: string;
  icon?: string;
  action?: ReactNode;
  items: KepcoinTimelineItem[];
  loading?: boolean;
  error?: string | null;
  emptyState: ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TimelineSkeleton = () => (
  <Stack spacing={3}>
    {Array.from({ length: 3 }).map((_, index) => (
      <Stack key={index} spacing={1.25} direction="column">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="text" width={120} height={20} />
        </Stack>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="60%" height={18} />
      </Stack>
    ))}
  </Stack>
);

const KepcoinTimelineCard = ({
  title,
  icon,
  action,
  items,
  loading,
  error,
  emptyState,
  page,
  totalPages,
  onPageChange,
}: KepcoinTimelineCardProps) => (
  <Card>
    <CardHeader
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          {icon && <IconifyIcon icon={icon} sx={{ color: 'warning.main' }} />}
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
      }
      action={action}
    />
    <CardContent>
      {loading ? (
        <TimelineSkeleton />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : items.length ? (
        <Stack spacing={3} sx={{ position: 'relative' }}>
          {items.map((item, index) => (
            <Stack key={item.id} spacing={1.25} sx={{ position: 'relative', pl: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <KepcoinValue value={item.amount} size="sm" />
                <Typography variant="body2" color="text.secondary">
                  {item.dateLabel}
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.primary">
                {item.description}
              </Typography>
              {item.media}

              <Stack
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                }}
              />
              {index !== items.length - 1 && (
                <Stack
                  sx={{
                    position: 'absolute',
                    left: 3,
                    top: 22,
                    bottom: -24,
                    width: 2,
                    bgcolor: 'divider',
                  }}
                />
              )}
            </Stack>
          ))}
        </Stack>
      ) : (
        emptyState
      )}

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" mt={4}>
          <Pagination
            color="warning"
            page={page}
            count={totalPages}
            onChange={(_, value) => onPageChange(value)}
            shape="rounded"
          />
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default KepcoinTimelineCard;
