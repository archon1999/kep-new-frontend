import { LinearProgress, Stack, Typography } from '@mui/material';

interface StreakMeterProps {
  streak?: number | null;
  maxStreak?: number | null;
  currentLabel?: string;
  maxLabel?: string;
}

const buildRow = (label: string, value: number, maxValue: number) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <LinearProgress
      variant="determinate"
      value={Math.min(100, (value / maxValue) * 100)}
      sx={{ flex: 1, height: 6, borderRadius: 999 }}
    />
    <Typography variant="body2" fontWeight={600} minWidth={32} textAlign="right">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const StreakMeter = ({ streak, maxStreak, currentLabel = 'Now', maxLabel = 'Max' }: StreakMeterProps) => {
  const current = streak ?? null;
  const longest = maxStreak ?? null;

  if (current === null && longest === null) {
    return <Typography color="text.secondary">—</Typography>;
  }

  const maxValue = Math.max(current ?? 0, longest ?? 0, 1);

  return (
    <Stack spacing={0.75} width="100%">
      {current !== null && buildRow(currentLabel, current, maxValue)}
      {longest !== null && buildRow(maxLabel, longest, maxValue)}
    </Stack>
  );
};

export default StreakMeter;
