import { Box, Stack, Typography, TypographyProps } from '@mui/material';
import kepcoinIcon from 'shared/assets/images/icons/kepcoin.png';

interface KepcoinValueProps {
  value: number | string;
  size?: number;
  textVariant?: TypographyProps['variant'];
}

const KepcoinValue = ({ value, size = 20, textVariant = 'body1' }: KepcoinValueProps) => (
  <Stack direction="row" alignItems="center" spacing={0.75}>
    <Box component="img" src={kepcoinIcon} alt="Kepcoin" sx={{ width: size, height: size }} />
    <Typography variant={textVariant} fontWeight={700} color="text.primary">
      {value}
    </Typography>
  </Stack>
);

export default KepcoinValue;
