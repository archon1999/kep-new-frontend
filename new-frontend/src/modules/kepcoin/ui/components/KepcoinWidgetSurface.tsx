import { Box, BoxProps, Divider } from '@mui/material';

interface KepcoinWidgetSurfaceProps extends BoxProps {
  disablePadding?: boolean;
}

const KepcoinWidgetSurface = ({
  children,
  disablePadding = false,
  sx,
  ...rest
}: KepcoinWidgetSurfaceProps) => (
  <Box
    {...rest}
    sx={{
      position: 'relative',
      bgcolor: 'background.paper',
      borderRadius: 3,
      overflow: 'hidden',
      ...sx,
    }}
  >
    <Divider
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
      }}
    />
    <Divider
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
      }}
    />
    <Divider
      orientation="vertical"
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
    <Divider
      orientation="vertical"
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        pointerEvents: 'none',
      }}
    />

    <Box sx={{ position: 'relative', zIndex: 1, p: disablePadding ? 0 : { xs: 3, md: 5 } }}>{children}</Box>
  </Box>
);

export default KepcoinWidgetSurface;
