import { Card, Skeleton, Stack } from '@mui/material';

const CalendarEventCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      p: 2.5,
      height: '100%',
      borderRadius: 2.5,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
    }}
  >
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="rounded" width={36} height={36} />
          <Stack spacing={0.5}>
            <Skeleton variant="text" width={160} height={24} />
            <Skeleton variant="text" width={90} height={16} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={96} height={28} />
      </Stack>

      <Stack spacing={1}>
        <Skeleton variant="text" width={120} height={16} />
        <Skeleton variant="text" width={160} height={20} />
      </Stack>
    </Stack>
  </Card>
);

export default CalendarEventCardSkeleton;
