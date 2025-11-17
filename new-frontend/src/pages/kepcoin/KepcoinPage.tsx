import {
  Avatar,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { kepcoinActivity, kepcoinSummary } from 'data/kepcoin';
import kepcoinHero from 'shared/assets/images/kepcoin-hero.svg';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const SummaryCard = ({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: string;
}) => (
  <Paper
    sx={{
      p: 3,
      height: 1,
      border: '1px solid',
      borderColor: 'divider',
      background:
        'linear-gradient(180deg, rgba(111, 125, 255, 0.06) 0%, rgba(15, 19, 41, 0.02) 100%)',
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Stack spacing={0.5}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
        >
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Stack>
      <Avatar sx={{ bgcolor: accent || 'primary.main', width: 44, height: 44 }}>
        <IconifyIcon icon={icon} />
      </Avatar>
    </Stack>
  </Paper>
);

const KepcoinPage = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        sx={{
          overflow: 'hidden',
          position: 'relative',
          p: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          background:
            'radial-gradient(circle at 20% 20%, rgba(108, 92, 255, 0.16), transparent 26%),\
            radial-gradient(circle at 80% 0%, rgba(92, 225, 230, 0.18), transparent 28%),\
            linear-gradient(180deg, rgba(12, 17, 35, 0.92) 0%, rgba(17, 24, 48, 0.88) 100%)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Chip
                color="primary"
                label="Kepcoin hub"
                sx={{ alignSelf: 'flex-start', fontWeight: 600, letterSpacing: 0.5 }}
              />
              <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 800 }}>
                Track, earn and spend Kepcoin with confidence
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                Your rewards wallet mirrors the original experience while adopting the Aurora
                polish. Stay on top of your daily streak, study boosts and marketplace purchases.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<IconifyIcon icon="solar:wallet-2-bold" />}
                >
                  View transactions
                </Button>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Current balance
                  </Typography>
                  <Typography variant="h5" color="common.white" fontWeight={800}>
                    {kepcoinSummary.balance} KP
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={kepcoinHero}
              alt="Kepcoin illustration"
              sx={{ width: '100%', maxWidth: 520, display: 'block', ml: 'auto' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            label="Wallet balance"
            value={`${kepcoinSummary.balance} KP`}
            icon="solar:wallet-3-bold"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            label="Earned today"
            value={`+${kepcoinSummary.todayEarnings} KP`}
            icon="solar:chart-square-bold-duotone"
            accent="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            label="This month"
            value={`+${kepcoinSummary.monthlyEarnings} KP`}
            icon="solar:calendar-mark-bold-duotone"
            accent="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            label="Reserved"
            value={`${kepcoinSummary.reserved} KP`}
            icon="solar:shield-check-bold"
            accent="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight={700}>
                Activity
              </Typography>
              <Chip
                label="Live"
                color="success"
                size="small"
                icon={<IconifyIcon icon="solar:record-bold" />}
              />
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {kepcoinActivity.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: 'divider',
                    backgroundColor: item.type === 'earn' ? 'action.hover' : 'background.default',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ sm: 'center' }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: item.type === 'earn' ? 'success.light' : 'warning.light',
                        color: item.type === 'earn' ? 'success.dark' : 'warning.dark',
                        width: 44,
                        height: 44,
                      }}
                    >
                      <IconifyIcon
                        icon={
                          item.type === 'earn'
                            ? 'solar:arrow-to-down-right-bold-duotone'
                            : 'solar:bag-smile-bold-duotone'
                        }
                      />
                    </Avatar>
                    <Stack flex={1} spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {item.title}
                        </Typography>
                        {item.tag && (
                          <Chip size="small" label={item.tag} color="primary" variant="soft" />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {item.timestamp}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: item.type === 'earn' ? 'success.main' : 'text.primary',
                        minWidth: 90,
                        textAlign: { xs: 'left', sm: 'right' },
                      }}
                    >
                      {item.type === 'earn' ? '+' : '-'}
                      {item.amount} KP
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Earning cadence
              </Typography>
              <IconifyIcon icon="solar:clock-circle-bold-duotone" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Stay aligned with the daily Kepcoin rhythm. Complete tasks to boost your streak and
              unlock more boosts.
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Daily streak health
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  82%
                </Typography>
              </Stack>
              <LinearProgress
                value={82}
                variant="determinate"
                sx={{ height: 10, borderRadius: 999 }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Weekly study pace
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  64%
                </Typography>
              </Stack>
              <LinearProgress
                value={64}
                variant="determinate"
                color="secondary"
                sx={{ height: 10, borderRadius: 999 }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Marketplace usage
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  42%
                </Typography>
              </Stack>
              <LinearProgress
                value={42}
                variant="determinate"
                color="warning"
                sx={{ height: 10, borderRadius: 999 }}
              />
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderColor: 'divider',
                background:
                  'linear-gradient(135deg, rgba(92, 225, 230, 0.18) 0%, rgba(106, 92, 255, 0.14) 100%)',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ sm: 'center' }}
              >
                <Avatar
                  sx={{ bgcolor: 'primary.main', color: 'common.white', width: 36, height: 36 }}
                >
                  <IconifyIcon icon="solar:magic-stick-bold-duotone" />
                </Avatar>
                <Stack flex={1} spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Double rewards active
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use boosters from the marketplace to multiply your next two earnings events.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default KepcoinPage;
