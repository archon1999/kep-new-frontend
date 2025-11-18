import { Chip, ChipProps, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

interface RatingChipProps {
  value?: number | string | null;
  label?: ReactNode;
  color?: ChipProps['color'];
  tooltip?: string;
}

const RatingChip = ({ value, label, color = 'default', tooltip }: RatingChipProps) => {
  if (value === undefined || value === null || value === '') {
    return <Chip size="small" variant="outlined" label="—" />;
  }

  const chip = (
    <Chip
      size="small"
      color={color}
      label={label ?? value}
      sx={{ fontWeight: 600 }}
      variant={color === 'default' ? 'outlined' : 'filled'}
    />
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{chip}</Tooltip>;
  }

  return chip;
};

export default RatingChip;
