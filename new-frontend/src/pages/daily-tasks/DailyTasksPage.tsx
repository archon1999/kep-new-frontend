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
import { DailyTaskStatus, dailyTasks } from 'data/daily-tasks';
import dailyTasksHero from 'shared/assets/images/daily-tasks-hero.svg';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const statusColor: Record<DailyTaskStatus, 'success' | 'warning' | 'default'> = {
  completed: 'success',
  'in-progress': 'warning',
  locked: 'default',
};

const DailyTasksPage = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background:
            'radial-gradient(circle at 10% 20%, rgba(92,225,230,0.16), transparent 36%),\
            radial-gradient(circle at 90% 10%, rgba(157,107,255,0.16), transparent 36%),\
            linear-gradient(180deg, rgba(12,16,32,0.94) 0%, rgba(15,19,41,0.9) 100%)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Chip
                label="Daily tasks"
                color="secondary"
                icon={<IconifyIcon icon="solar:calendar-bold-duotone" />}
                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
              />
              <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 800 }}>
                Stay in sync with your routines
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                Daily missions, streak boosters and community actions arrive from the old app with a
                refreshed Aurora layout. Keep completing tasks to unlock Kepcoin and bonuses.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<IconifyIcon icon="solar:flash-bold-duotone" />}
                >
                  Start next task
                </Button>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Progress today
                  </Typography>
                  <Typography variant="h5" color="common.white" fontWeight={800}>
                    3 / 4 completed
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={dailyTasksHero}
              alt="Daily tasks"
              sx={{ width: '100%', maxWidth: 520, display: 'block', ml: 'auto' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight={700}>
                Today&apos;s missions
              </Typography>
              <Chip
                label="Auto-synced"
                size="small"
                icon={<IconifyIcon icon="solar:cloud-sync-bold-duotone" />}
              />
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              {dailyTasks.map((task) => (
                <Paper
                  key={task.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: 'divider',
                    backgroundColor:
                      task.status === 'completed' ? 'action.hover' : 'background.default',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ sm: 'center' }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${statusColor[task.status]}.light`,
                        color: `${statusColor[task.status]}.dark`,
                        width: 44,
                        height: 44,
                      }}
                    >
                      <IconifyIcon
                        icon={
                          task.status === 'locked'
                            ? 'solar:lock-keyhole-bold-duotone'
                            : 'solar:check-square-bold-duotone'
                        }
                      />
                    </Avatar>
                    <Stack flex={1} spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {task.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${task.reward} KP`}
                          color="primary"
                          variant="soft"
                          icon={<IconifyIcon icon="solar:stars-bold-duotone" />}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    </Stack>
                    <Chip
                      label={task.status.replace('-', ' ')}
                      color={statusColor[task.status]}
                      variant={task.status === 'locked' ? 'outlined' : 'filled'}
                      sx={{ textTransform: 'capitalize', minWidth: 110, textAlign: 'center' }}
                    />
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
                Streak health
              </Typography>
              <IconifyIcon icon="solar:heart-pulse-2-bold-duotone" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              The cadence from the old dashboard is still here. Keep the streak meter topped up to
              maintain bonus Kepcoin drops.
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Focus time completed
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  75%
                </Typography>
              </Stack>
              <LinearProgress
                value={75}
                variant="determinate"
                sx={{ height: 10, borderRadius: 999 }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Community actions
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  58%
                </Typography>
              </Stack>
              <LinearProgress
                value={58}
                variant="determinate"
                color="secondary"
                sx={{ height: 10, borderRadius: 999 }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Booster uptime
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  46%
                </Typography>
              </Stack>
              <LinearProgress
                value={46}
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
                  'linear-gradient(135deg, rgba(92, 225, 230, 0.18) 0%, rgba(106, 92, 255, 0.12) 100%)',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ sm: 'center' }}
              >
                <Avatar
                  sx={{ bgcolor: 'secondary.main', color: 'common.white', width: 36, height: 36 }}
                >
                  <IconifyIcon icon="solar:alarm-bell-bold-duotone" />
                </Avatar>
                <Stack flex={1} spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Daily reminder
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enable notifications to get a gentle nudge when new tasks drop.
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

export default DailyTasksPage;
