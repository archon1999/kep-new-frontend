import { useMemo, useState } from 'react';
import { Avatar, Box, Button, LinearProgress, Popover, Skeleton, Stack, Typography, badgeClasses, linearProgressClasses, paperClasses } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { DailyTask, DailyTaskType } from 'app/types/dailyTasks';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { getKepIcon } from 'shared/config/icons';
import kepcoinIcon from 'shared/assets/images/icons/kepcoin.png';
import { useDailyTasks } from 'shared/services/swr/api-hooks/useDailyTasks';

const taskTypeMeta: Record<DailyTaskType, { label: string; color: 'primary' | 'info' | 'warning'; icon: string }> = {
  [DailyTaskType.Problem]: { label: 'Problem', color: 'primary', icon: getKepIcon('problem') },
  [DailyTaskType.Test]: { label: 'Test', color: 'info', icon: getKepIcon('test') },
  [DailyTaskType.Challenge]: { label: 'Challenge', color: 'warning', icon: getKepIcon('challenge') },
};

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { data, isValidating, mutate, error } = useDailyTasks(Boolean(currentUser));

  const dailyTasks = data?.dailyTasks ?? [];
  const streak = data?.streak ?? 0;
  const maxStreak = data?.maxStreak ?? 0;

  const completedCount = useMemo(
    () => dailyTasks.filter((task) => task.completed).length,
    [dailyTasks],
  );

  const completionPercentage = useMemo(
    () => (dailyTasks.length ? Math.trunc((completedCount / dailyTasks.length) * 100) : 0),
    [completedCount, dailyTasks.length],
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (currentUser) {
      mutate();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        color="warning"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
      >
        <OutlinedBadge
          badgeContent={dailyTasks.length || null}
          overlap="circular"
          color="error"
          sx={{
            [`& .${badgeClasses.badge}`]: {
              minWidth: 18,
              height: 18,
              fontSize: 11,
              top: -4,
              right: -4,
            },
          }}
        >
          <IconifyIcon icon={getKepIcon('streak')} sx={{ fontSize: type === 'slim' ? 18 : 22 }} />
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
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            minHeight: 320,
            maxHeight: 640,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack spacing={2} sx={{ px: 3, pt: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Daily tasks
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Keep your streak alive — best {maxStreak} days
              </Typography>
            </Box>
            <Stack
              spacing={0.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.08),
                minWidth: 110,
              }}
            >
              <Typography variant="overline" sx={{ color: 'warning.main', fontWeight: 700 }}>
                Streak
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconifyIcon icon={getKepIcon('streak')} sx={{ color: 'warning.main', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {streak} days
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {completedCount} of {dailyTasks.length || 0} tasks completed
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {completionPercentage}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.success.main, 0.12),
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 999,
                  backgroundImage: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.warning.main})`,
                },
              }}
            />
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, overflow: 'hidden', px: 1.5, pb: 2, pt: 1 }}>
          <SimpleBar disableHorizontal>
            <Stack spacing={1.25} sx={{ p: 1 }}>
              {!currentUser && (
                <EmptyState
                  icon="material-symbols:lock-outline-rounded"
                  title="Sign in to track daily tasks"
                  description="Access your streak and daily rewards by logging in."
                />
              )}

              {currentUser && error && (
                <EmptyState
                  icon="material-symbols:warning-outline-rounded"
                  title="Unable to load tasks"
                  description="Please try again in a moment."
                />
              )}

              {currentUser && isValidating && !data && <TaskSkeletons />}

              {currentUser && !isValidating && !error && dailyTasks.length === 0 && (
                <EmptyState
                  icon="material-symbols:check-circle-outline-rounded"
                  title="You are all caught up"
                  description="No daily tasks available right now."
                />
              )}

              {currentUser && dailyTasks.map((task) => <TaskItem key={`${task.type}-${task.description}`} task={task} />)}
            </Stack>
          </SimpleBar>
        </Box>
      </Popover>
    </>
  );
};

interface TaskItemProps {
  task: DailyTask;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const theme = useTheme();
  const meta = taskTypeMeta[task.type] ?? taskTypeMeta[DailyTaskType.Problem];
  const progress = task.total ? Math.min(100, Math.round((task.progress / task.total) * 100)) : 0;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: task.completed
          ? alpha(theme.palette.success.main, 0.08)
          : alpha(theme.palette[meta.color].main, 0.05),
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 44,
          height: 44,
          bgcolor: alpha(theme.palette[meta.color].main, 0.18),
          color: theme.palette[meta.color].main,
        }}
      >
        <IconifyIcon icon={meta.icon} sx={{ fontSize: 22 }} />
      </Avatar>
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
            {task.description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 70, justifyContent: 'flex-end' }}>
            <Box component="img" src={kepcoinIcon} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {task.kepcoin}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StatusPill label={task.completed ? 'Completed' : meta.label} color={task.completed ? 'success' : meta.color} />
            {!task.completed && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                {task.progress}/{task.total}
              </Typography>
            )}
            {task.completed && (
              <IconifyIcon
                icon="material-symbols:check-circle-rounded"
                sx={{ color: 'success.main', fontSize: 18, ml: 'auto' }}
              />
            )}
          </Stack>

          {!task.completed && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: alpha(theme.palette[meta.color].main, 0.12),
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 999,
                  backgroundColor: theme.palette[meta.color].main,
                },
              }}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

interface StatusPillProps {
  label: string;
  color: 'primary' | 'info' | 'warning' | 'success';
}

const StatusPill = ({ label, color }: StatusPillProps) => {
  const theme = useTheme();
  const paletteColor = theme.palette[color];

  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.5,
        borderRadius: 99,
        bgcolor: alpha(paletteColor.main, 0.12),
        color: paletteColor.main,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {label}
    </Box>
  );
};

const TaskSkeletons = () => {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <Stack key={key} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5 }}>
          <Skeleton variant="rounded" width={44} height={44} />
          <Stack spacing={0.75} sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={18} />
            <Skeleton variant="rounded" width="100%" height={10} />
          </Stack>
        </Stack>
      ))}
    </>
  );
};

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <Stack
      spacing={1}
      sx={{
        borderRadius: 2,
        px: 2,
        py: 3,
        alignItems: 'center',
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <IconifyIcon icon={icon} sx={{ color: 'text.secondary', fontSize: 28 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Stack>
  );
};

export default DailyTasksMenu;
