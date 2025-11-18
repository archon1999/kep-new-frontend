import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import KepcoinValue from './KepcoinValue';

interface TipsCardProps {
  title: string;
  description?: string;
  items: { value: number | string; label: string }[];
}

const TipsCard = ({ title, description, items }: TipsCardProps) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardHeader title={title} subheader={description} sx={{ pb: 1 }} />
    <Divider />
    <CardContent sx={{ flex: 1 }}>
      <Stack spacing={2.5}>
        {items.map((item) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="flex-start">
            <KepcoinValue value={item.value} size={18} textVariant="body2" />
            <Typography variant="body2" color="text.primary">
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default TipsCard;
