import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

interface HowToItem {
  value: string;
  labelKey: string;
}

interface HowToCardProps {
  titleKey: string;
  descriptionKey?: string;
  icon: string;
  items: HowToItem[];
}

const HowToCard = ({ titleKey, descriptionKey, icon, items }: HowToCardProps) => {
  const { t } = useTranslation();

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon={icon} sx={{ color: 'text.primary', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t(titleKey)}
            </Typography>
          </Stack>
        }
      />

      <CardContent>
        <Stack spacing={1.5}>
          {descriptionKey && (
            <Typography variant="body2" color="text.secondary">
              {t(descriptionKey)}
            </Typography>
          )}

          <Stack spacing={1.25}>
            {items.map((item) => (
              <Stack key={`${item.labelKey}-${item.value}`} direction="row" spacing={1.5} alignItems="center">
                <Stack direction="row" spacing={0.75} alignItems="center" minWidth={0}>
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 22, height: 22 }} />
                  <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                    {item.value}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t(item.labelKey)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HowToCard;
