import { Card, Divider, Skeleton, Stack } from '@mui/material';

const ChallengeCardSkeleton = () => (
  <Card sx={{ p: 2.5, borderRadius: 3 }} elevation={0}>
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={160} height={18} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={32} />
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={160} height={18} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={32} />
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Skeleton variant="rounded" width={140} height={32} />
          <Skeleton variant="rounded" width={140} height={32} />
          <Skeleton variant="rounded" width={120} height={32} />
        </Stack>
        <Skeleton variant="rounded" width={180} height={32} />
      </Stack>
    </Stack>
  </Card>
);

export default ChallengeCardSkeleton;
