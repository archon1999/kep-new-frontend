import { Alert, Box, Typography } from '@mui/material';
import { defaultAuthCredentials } from 'app/config.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const DefaultCredentialAlert = () => {
  return (
    <Alert
      severity="info"
      sx={{ mb: 4 }}
      icon={<IconifyIcon icon="material-symbols:info-outline-rounded" />}
    >
      <Typography variant="body2">
        Use Email :{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {defaultAuthCredentials.email}
        </Box>
      </Typography>
      <Typography variant="body2">
        Password :{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {defaultAuthCredentials.password}
        </Box>
      </Typography>
    </Alert>
  );
};

export default DefaultCredentialAlert;
