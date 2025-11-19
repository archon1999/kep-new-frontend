import { Box, Stack, Typography } from '@mui/material';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

interface KepcoinValueProps {
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fontWeight?: number;
}

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
} as const;

const textVariantMap = {
  sm: 'body2',
  md: 'body1',
  lg: 'h5',
} as const;

const KepcoinValue = ({ value, size = 'md', color = 'text.primary', fontWeight = 700 }: KepcoinValueProps) => (
  <Stack direction="row" spacing={0.75} alignItems="center">
    <Box
      component="img"
      src={kepcoinImage}
      alt="Kepcoin"
      sx={{ width: iconSizeMap[size], height: iconSizeMap[size] }}
    />
    <Typography variant={textVariantMap[size]} fontWeight={fontWeight} color={color}>
      {value}
    </Typography>
  </Stack>
);

export default KepcoinValue;
