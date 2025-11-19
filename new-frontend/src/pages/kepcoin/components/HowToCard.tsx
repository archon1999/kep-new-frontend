import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from './KepcoinValue';

export interface HowToItem {
  value: string;
  label: string;
}

interface HowToCardProps {
  title: string;
  icon: string;
  description?: string;
  items: HowToItem[];
}

const HowToCard = ({ title, icon, description, items }: HowToCardProps) => (
  <Card>
    <CardHeader
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          <IconifyIcon icon={icon} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
      }
    />
    <CardContent>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
      )}
      <Stack spacing={1.5}>
        {items.map((item) => (
          <Stack key={`${item.value}-${item.label}`} direction="row" spacing={1} alignItems="center">
            <KepcoinValue value={item.value} size="sm" />
            <Typography variant="body2" color="text.primary">
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default HowToCard;
