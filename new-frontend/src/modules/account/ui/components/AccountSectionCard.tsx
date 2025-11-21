import { PropsWithChildren, ReactNode } from 'react';
import { Stack, Typography, Paper, Divider } from '@mui/material';

interface AccountSectionCardProps extends PropsWithChildren {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const AccountSectionCard = ({ title, icon, actions, children }: AccountSectionCardProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'background.elevation1',
      borderColor: 'divider',
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Typography variant="h6" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
          {title}
        </Typography>
      </Stack>
      {actions}
    </Stack>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

export default AccountSectionCard;
