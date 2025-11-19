import { Box, Stack, Typography } from '@mui/material';
import { useKepcoinContent } from '../../application/queries';

const KepcoinPage = () => {
  const { title, description } = useKepcoinContent();

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;
