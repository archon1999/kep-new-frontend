import { Card, CardContent, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const SYSTEM_START = dayjs('2021-07-07');

const SystemSection = () => {
  const today = dayjs();
  const days = today.diff(SYSTEM_START, 'day');

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack alignItems="center" spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {today.format('ddd')}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {today.format('D')}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {today.format('MMMM YYYY')}
            </Typography>
          </Stack>
        </Stack>
        <Stack alignItems="center" spacing={1} mt={1}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 80,
              height: 80,
              borderRadius: 6,
              bgcolor: 'primary.light',
              color: 'primary.dark',
            }}
          >
            <IconifyIcon icon="solar:calendar-minimalistic-line-duotone" width={36} height={36} />
          </Stack>
          <Typography variant="h3" fontWeight={700}>
            {days}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Day
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SystemSection;
