import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
  Typography,
  alpha,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { DailyTask, DailyTaskType, DailyTasksResponse } from 'app/types/dailyTasks';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { apiClient } from 'shared/api';

const taskTypeMeta: Record<DailyTaskType, { icon: string; color: 'primary' | 'info' | 'warning'; label: string }> = {
  [DailyTaskType.Problem]: {
    icon: 'solar:book-2-bold-duotone',
    color: 'primary',
    label: 'Problem',
  },
  [DailyTaskType.Test]: {
    icon: 'solar:checklist-minimalistic-bold-duotone',
    color: 'info',
    label: 'Test',
  },
  [DailyTaskType.Challenge]: {
    icon: 'solar:target-bold-duotone',
    color: 'warning',
    label: 'Challenge',
  },
};

const fetchDailyTasks = async () =>
  (await apiClient.apiDailyTasksList()) as unknown as DailyTasksResponse;

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DailyTasksResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    config: { textDirection },
  } = useSettingsContext();

  const open = Boolean(anchorEl);

  const tasks = data?.dailyTasks ?? [];
  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const completionPct = useMemo(
    () => (tasks.length ? Math.trunc((completedCount / tasks.length) * 100) : 0),
    [tasks, completedCount],
  );

  useEffect(() => {
    if (!open || isLoading || data) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDailyTasks();
        setData(response);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load daily tasks');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [open, isLoading, data]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderTask = (task: DailyTask, index: number) => {
    const meta = taskTypeMeta[task.type];
    const progressValue = task.total ? Math.trunc((task.progress / task.total) * 100) : 0;

    return (
      <ListItem
        key={`${task.description}-${index}`}
        sx={{
          alignItems: 'flex-start',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:not(:last-of-type)': { mb: 1 },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={(theme) => ({
              bgcolor: alpha(theme.vars.palette[meta.color]?.main || theme.palette.primary.main, 0.12),
              color: theme.vars.palette[meta.color]?.main || theme.palette.primary.main,
            })}
          >
            <IconifyIcon icon={meta.icon} sx={{ fontSize: 22 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography variant="subtitle2">{task.description}</Typography>
              <Chip
                size="small"
                color={meta.color}
                variant="soft"
                label={meta.label}
                sx={{ height: 24 }}
              />
              <Chip
                size="small"
                color="warning"
                variant="soft"
                icon={<IconifyIcon icon="solar:wallet-3-bold-duotone" sx={{ fontSize: 16 }} />}
                label={`+${task.kepcoin}`}
                sx={{ height: 24 }}
              />
            </Stack>
          }
          secondary={
            task.completed ? (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                icon={<IconifyIcon icon="material-symbols:check-circle-rounded" sx={{ fontSize: 18 }} />}
                label="Completed"
                sx={{ mt: 1, height: 26 }}
              />
            ) : (
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">{`${task.progress}/${task.total} completed`}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    [`& .MuiLinearProgress-bar`]: {
                      borderRadius: 999,
                    },
                  }}
                />
              </Stack>
            )
          }
        />
      </ListItem>
    );
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleClick}
        aria-label="Daily tasks"
      >
        <OutlinedBadge
          badgeContent={`${completionPct}%`}
          color={completionPct === 100 ? 'success' : 'warning'}
          overlap="circular"
          max={999}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              fontWeight: 700,
              px: 0.75,
              py: 0.25,
              borderRadius: 12,
              letterSpacing: 0.2,
              backgroundColor: 'background.paper',
            },
          }}
        >
          <IconifyIcon icon="solar:fire-bold-duotone" sx={{ fontSize: type === 'slim' ? 18 : 22 }} />
        </OutlinedBadge>
      </Button>
      <Popover
        anchorEl={anchorEl}
        id="daily-tasks-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            width: 440,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 16,
            overflow: 'hidden',
          },
        }}
      >
        <Stack spacing={2.5} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 2,
                flex: 1,
                borderRadius: 3,
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(theme.vars.palette.primary.main, 0.12)}, ${alpha(theme.vars.palette.primary.main, 0.04)})`,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconifyIcon icon="solar:fire-square-bold-duotone" sx={{ fontSize: 26 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current streak
                  </Typography>
                  <Typography variant="h6" component="div">
                    {data?.streak ?? 0} days
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    label={`Best: ${data?.maxStreak ?? 0} days`}
                    sx={{ height: 24, mt: 0.5 }}
                  />
                </Box>
              </Stack>
            </Box>
            <Stack spacing={1} sx={{ minWidth: 140 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">Daily tasks</Typography>
                <Chip
                  size="small"
                  color="neutral"
                  variant="outlined"
                  label={`${tasks.length} tasks`}
                  sx={{ height: 24 }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {completedCount} of {tasks.length || 0} completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionPct}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  [`& .MuiLinearProgress-bar`]: {
                    borderRadius: 999,
                  },
                }}
              />
            </Stack>
          </Stack>

          {isLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }} spacing={1}>
              <CircularProgress size={28} thickness={5} />
              <Typography variant="body2" color="text.secondary">
                Loading daily tasks...
              </Typography>
            </Stack>
          )}

          {!isLoading && error && (
            <Stack spacing={1} alignItems="center" sx={{ py: 3 }}>
              <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                <IconifyIcon icon="solar:bug-outline" sx={{ fontSize: 24 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {error}
              </Typography>
              <Button size="small" variant="contained" onClick={() => setData(null)}>
                Retry
              </Button>
            </Stack>
          )}

          {!isLoading && !error && (
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                maxHeight: 380,
              }}
            >
              {tasks.length ? (
                <SimpleBar disableHorizontal>
                  <List sx={{ py: 2, px: 1.5 }}>{tasks.map(renderTask)}</List>
                </SimpleBar>
              ) : (
                <Stack spacing={1} alignItems="center" sx={{ py: 4 }}>
                  <Avatar sx={{ bgcolor: 'neutral.softBg', color: 'text.secondary' }}>
                    <IconifyIcon icon="solar:list-cross-bold-duotone" sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No daily tasks available right now.
                  </Typography>
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
