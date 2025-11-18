import { Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';

interface UserStreakCellProps {
  streak?: number;
  maxStreak?: number;
  currentLabel: string;
  bestLabel: string;
}

const UserStreakCell = ({ streak, maxStreak, currentLabel, bestLabel }: UserStreakCellProps) => {
  return (
    <Stack spacing={0.75} sx={{ minWidth: 140 }}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <KepIcon name="streak" fontSize={18} />
        <Typography variant="body2" color="text.secondary">
          {currentLabel}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" fontWeight={700}>
        {streak ?? '—'}
      </Typography>

      <Stack direction="row" spacing={0.5} alignItems="center">
        <KepIcon name="rating" fontSize={18} />
        <Typography variant="body2" color="text.secondary">
          {bestLabel}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" fontWeight={700}>
        {maxStreak ?? '—'}
      </Typography>
    </Stack>
  );
};

export default UserStreakCell;
