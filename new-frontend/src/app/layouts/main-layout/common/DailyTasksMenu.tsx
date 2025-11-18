import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Popover,
  Stack,
  Typography,
  alpha,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { DailyTask, DailyTaskType } from 'app/types/dailyTasks';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { useDailyTasks } from 'shared/services/swr/api-hooks/useDailyTasksApi';

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const taskMeta: Record<DailyTaskType, { icon: string; color: string; label: string }> = {
  [DailyTaskType.Problem]: {
    icon: 'mdi:code-tags',
    color: 'primary.main',
    label: 'Problem',
  },
  [DailyTaskType.Test]: {
    icon: 'mdi:clipboard-check-outline',
    color: 'info.main',
    label: 'Test',
  },
  [DailyTaskType.Challenge]: {
    icon: 'mdi:lightning-bolt-outline',
    color: 'warning.main',
    label: 'Challenge',
  },
};

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data, isLoading, mutate } = useDailyTasks({
    suspense: false,
  });
  const {
    config: { textDirection },
  } = useSettingsContext();

  const open = Boolean(anchorEl);
  const tasks = data?.dailyTasks ?? [];
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  const overallProgress = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    void mutate();
  };

  const handleClose = () => setAnchorEl(null);

  const renderTask = (task: DailyTask, index: number) => {
    const meta = taskMeta[task.type] ?? taskMeta[DailyTaskType.Problem];
    const taskProgress = task.total ? Math.min(100, Math.round((task.progress / task.total) * 100)) : 0;

    return (
      <Stack
        key={`${task.description}-${index}`}
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.elevation1',
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: meta.color,
            width: 46,
            height: 46,
          }}
        >
          <IconifyIcon icon={meta.icon} sx={{ fontSize: 22 }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {task.description}
            </Typography>
            <Chip
              label={meta.label}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1, borderColor: alpha('#000', 0.08) }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Chip
              color="warning"
              size="small"
              label={`${task.kepcoin} Kepcoin`}
              icon={<IconifyIcon icon="mdi:coin-outline" sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {task.completed ? 'Completed' : `${task.progress}/${task.total} progress`}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={task.completed ? 100 : taskProgress}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
        <Chip
          size="small"
          label={task.completed ? 'Done' : 'In progress'}
          color={task.completed ? 'success' : 'info'}
          variant={task.completed ? 'soft' : 'outlined'}
          sx={{ minWidth: 96, justifyContent: 'center' }}
        />
      </Stack>
    );
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape={type === 'default' ? 'square' : 'circle'}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
        sx={{ px: type === 'slim' ? 1 : 1.5, minWidth: type === 'slim' ? 0 : 120 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: 1 }}>
          <OutlinedBadge
            color="success"
            max={totalTasks}
            overlap="circular"
            badgeContent={completedTasks}
            invisible={!totalTasks}
            sx={{ '& .MuiBadge-badge': { minWidth: 18, height: 18 } }}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                width: type === 'slim' ? 32 : 40,
                height: type === 'slim' ? 32 : 40,
              }}
            >
              <IconifyIcon icon="mdi:fire" sx={{ fontSize: type === 'slim' ? 18 : 22 }} />
            </Avatar>
          </OutlinedBadge>
          {type !== 'slim' && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Daily Tasks
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
                <LinearProgress value={overallProgress} variant="determinate" sx={{ flex: 1, height: 6 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {overallProgress}%
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
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
            width: 460,
            p: 2,
          },
        }}
      >
        <Stack spacing={2} sx={{ minHeight: 360 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              color: 'common.white',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.4)})`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                variant="rounded"
                sx={{ bgcolor: alpha('#fff', 0.16), color: 'common.white', width: 44, height: 44 }}
              >
                <IconifyIcon icon="mdi:fire" sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {data?.streak ?? 0}-day streak
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                  Max streak: {data?.maxStreak ?? 0}
                </Typography>
              </Box>
              <Chip
                label={`${overallProgress}%`}
                color="success"
                size="small"
                sx={{ ml: 'auto', bgcolor: alpha('#fff', 0.15), color: 'common.white' }}
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{
                mt: 2,
                height: 10,
                borderRadius: 2,
                bgcolor: alpha('#fff', 0.15),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'common.white',
                },
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Daily tasks
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {completedTasks}/{totalTasks || 1} completed
            </Typography>
          </Stack>

          <Divider />

          <Box sx={{ flex: 1, minHeight: 220 }}>
            <SimpleBar disableHorizontal>
              <Stack spacing={1.5} sx={{ p: 0.25 }}>
                {isLoading && !tasks.length && (
                  <>
                    {[1, 2, 3].map((key) => (
                      <Box key={key} sx={{ p: 1, borderRadius: 2, bgcolor: 'background.elevation1' }}>
                        <LinearProgress variant="indeterminate" sx={{ height: 8 }} />
                      </Box>
                    ))}
                  </>
                )}
                {!isLoading && !tasks.length && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                    No daily tasks available yet.
                  </Typography>
                )}
                {tasks.map(renderTask)}
              </Stack>
            </SimpleBar>
          </Box>

          {totalTasks > 0 && (
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.elevation1', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <IconifyIcon icon="mdi:target" sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Progress overview
                </Typography>
                <Chip
                  size="small"
                  label={`${completedTasks}/${totalTasks} tasks`}
                  variant="outlined"
                  sx={{ ml: 'auto', borderRadius: 1 }}
                />
              </Stack>
              <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 10, borderRadius: 2 }} />
            </Box>
          )}
        </Stack>
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
