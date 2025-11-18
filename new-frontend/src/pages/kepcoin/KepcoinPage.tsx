import { Box, Stack, Typography } from '@mui/material';

const KepcoinPage = () => {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Kepcoin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bu sahifa tez orada to&apos;ldiriladi.
        </Typography>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;
