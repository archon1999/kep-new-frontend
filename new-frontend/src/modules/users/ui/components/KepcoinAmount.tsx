import { Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';

interface KepcoinAmountProps {
  value?: number | null;
}

const KepcoinAmount = ({ value }: KepcoinAmountProps) => {
  if (value === undefined || value === null) {
    return <Typography color="text.secondary">—</Typography>;
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
      <KepIcon name="rating" fontSize={18} />
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
};

export default KepcoinAmount;
