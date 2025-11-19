import { Box, BoxProps } from '@mui/material';
import { useId } from 'react';

interface KepcoinIconProps extends BoxProps {
  size?: number;
}

const KepcoinIcon = ({ size = 20, sx, ...boxProps }: KepcoinIconProps) => {
  const maskId = useId().replace(/:/g, '-');

  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      sx={{ display: 'block', color: 'inherit', ...sx }}
      {...boxProps}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <g fill="black">
            <rect x="25" y="20" width="12" height="60" />
            <rect x="15" y="44" width="40" height="12" />
            <polygon points="40,50 70,20 82,20 52,50" />
            <polygon points="40,50 70,80 82,80 52,50" />
          </g>
        </mask>
      </defs>

      <circle cx="50" cy="50" r="48" fill="currentColor" mask={`url(#${maskId})`} />
    </Box>
  );
};

export default KepcoinIcon;
