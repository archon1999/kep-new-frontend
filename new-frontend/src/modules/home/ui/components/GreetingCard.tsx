import { Avatar, Chip, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Tooltip, Typography, chipClasses } from '@mui/material';
import dayjs from 'dayjs';
import SimpleBar from 'shared/components/base/SimpleBar';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface GreetingStat {
  icon: string;
  value: string;
  label: string;
}

interface GreetingOrder {
  id: number;
  productName: string;
  price: string;
  statusIcon: string;
  status: 'primary' | 'warning' | 'success';
}

interface GreetingCardProps {
  displayName: string;
}

const stats: GreetingStat[] = [
  {
    icon: 'material-symbols-light:ads-click-rounded',
    value: '2,110',
    label: 'homePage.greeting.stats.visitors',
  },
  {
    icon: 'material-symbols-light:request-quote-outline-rounded',
    value: '$8.2M',
    label: 'homePage.greeting.stats.earnings',
  },
  {
    icon: 'material-symbols-light:shopping-cart-checkout-rounded',
    value: '1,124',
    label: 'homePage.greeting.stats.orders',
  },
];

const orders: GreetingOrder[] = [
  {
    id: 1,
    productName: 'New React course bundle',
    price: '$480',
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 2,
    productName: 'Team workshop kit',
    price: '$320',
    statusIcon: 'material-symbols:local-shipping-outline',
    status: 'primary',
  },
  {
    id: 3,
    productName: 'UI templates pack',
    price: '$260',
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },
  {
    id: 4,
    productName: 'Mentorship tokens',
    price: '$640',
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 5,
    productName: 'Bug bounty rewards',
    price: '$150',
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },
];

const statusTranslationMap: Record<GreetingOrder['status'], string> = {
  primary: 'homePage.greeting.orderStatus.shipped',
  warning: 'homePage.greeting.orderStatus.processing',
  success: 'homePage.greeting.orderStatus.delivered',
};

const GreetingCard = ({ displayName }: GreetingCardProps) => {
  const { t } = useTranslation();
  const todayLabel = useMemo(() => dayjs().format('dddd, MMM DD, YYYY'), []);

  return (
    <Paper sx={{ height: 1 }}>
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        sx={{
          gap: 3,
          p: { xs: 3, md: 5 },
          height: 1,
          overflow: 'hidden',
        }}
      >
      <Stack direction="column" spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {todayLabel}
        </Typography>

        <Typography variant="h5" display="flex" columnGap={1} flexWrap="wrap">
          {t('homePage.greeting.goodMorning', { name: displayName })}
        </Typography>
      </Stack>

      <div>
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'column' }}
          sx={{
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          {stats.map(({ icon, label, value }) => (
            <Stack
              key={label}
              direction={{ xs: 'row', sm: 'column', md: 'row' }}
              sx={{
                gap: 1,
                flexWrap: 'wrap',
                alignItems: { xs: 'center', sm: 'flex-start', md: 'center' },
                flex: 1,
                px: { sm: 3, md: 0 },
                borderLeft: { sm: 1, md: 'none' },
                borderColor: { sm: 'divider' },
              }}
            >
              <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                <IconifyIcon icon={icon} sx={{ fontSize: 24 }} />
              </Avatar>
              <Stack
                direction={{ xs: 'row', sm: 'column', md: 'row' }}
                sx={{
                  gap: 0.5,
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  {t(label)}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </div>

      <Stack direction="column" gap={2} sx={{ flex: 1 }}>
        <SimpleBar sx={{ maxHeight: { xs: 300, md: 368, lg: 596, xl: 376 }, height: 'min-content' }}>
          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              gap: 1,
              flexWrap: { sm: 'wrap', md: 'nowrap' },
            }}
          >
            {orders.map(({ id, productName, price, status, statusIcon }) => (
              <ListItemButton
                key={id}
                sx={{
                  minWidth: { xs: 0, sm: 254, md: 0 },
                  py: 1.75,
                  px: 1.5,
                  bgcolor: 'background.elevation2',
                  borderRadius: 2,
                  gap: 1,
                  '&:hover': {
                    backgroundColor: 'background.elevation3',
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.lighter', color: 'primary.darker' }}>
                    <IconifyIcon icon="material-symbols:inventory-2-outline" />
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={productName}
                  secondary={price}
                  slotProps={{
                    primary: {
                      sx: {
                        typography: 'body2',
                        fontWeight: 600,
                        color: 'text.primary',
                        lineClamp: 1,
                      },
                    },
                    secondary: {
                      sx: {
                        typography: 'caption',
                        fontWeight: 600,
                        lineClamp: 1,
                      },
                    },
                  }}
                />

                <Tooltip title={t(statusTranslationMap[status])}>
                  <Chip
                    variant="soft"
                    icon={<IconifyIcon icon={statusIcon} fontSize={16} />}
                    color={status}
                    size="small"
                    sx={{
                      height: 24,
                      width: 24,
                      [`& .${chipClasses.label}`]: {
                        display: 'none',
                      },
                    }}
                  />
                </Tooltip>
              </ListItemButton>
            ))}
          </List>
        </SimpleBar>
      </Stack>
    </Stack>
  </Paper>
  );
};

export default GreetingCard;
