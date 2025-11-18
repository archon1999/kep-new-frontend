import { Chip, ChipProps, Typography } from '@mui/material';

import { UserRating } from '../domain/entities/user.entity';

interface UserRatingChipProps {
  rating?: UserRating;
  color?: ChipProps['color'];
}

const UserRatingChip = ({ rating, color = 'primary' }: UserRatingChipProps) => {
  if (rating?.value === undefined || rating?.value === null) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Chip
      size="small"
      color={color}
      variant="outlined"
      label={rating.title ? `${rating.title} · ${rating.value}` : rating.value}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default UserRatingChip;
