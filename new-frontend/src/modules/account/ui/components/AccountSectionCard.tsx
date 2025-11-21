import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

interface AccountSectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  action?: ReactNode;
}

const AccountSectionCard = ({ title, description, action, children }: AccountSectionCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader
      title={<Typography variant="h6">{title}</Typography>}
      subheader={description}
      action={action}
      sx={{ pb: 0 }}
    />
    <Divider />
    <CardContent>
      <Stack spacing={3}>{children}</Stack>
    </CardContent>
  </Card>
);

export default AccountSectionCard;
