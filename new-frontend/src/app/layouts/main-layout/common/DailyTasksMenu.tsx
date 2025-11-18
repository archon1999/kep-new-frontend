import { MouseEvent, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
  Typography,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import { getKepIcon } from 'shared/config/icons';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import useSWRMutation from 'swr/mutation';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

interface DailyTask {
  type: DailyTaskType;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
}

interface DailyTasksResponse {
  streak: number;
  maxStreak: number;
  dailyTasks: DailyTask[];
}

enum DailyTaskType {
  Problem = 1,
  Test,
  Challenge,
}

const taskIconMap: Record<DailyTaskType, string> = {
  [DailyTaskType.Problem]: getKepIcon('problem'),
  [DailyTaskType.Test]: getKepIcon('test'),
  [DailyTaskType.Challenge]: getKepIcon('challenge'),
};

const taskColorMap: Record<DailyTaskType, string> = {
  [DailyTaskType.Problem]: 'primary',
  [DailyTaskType.Test]: 'info',
  [DailyTaskType.Challenge]: 'warning',
};

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { trigger: fetchDailyTasks, data, isMutating } = useSWRMutation<DailyTasksResponse>(
    ['/api/daily-tasks', { method: 'get' }],
    axiosFetcher,
    {
      throwOnError: false,
    },
  );

  const {
    config: { textDirection },
  } = useSettingsContext();

  const tasks = data?.dailyTasks ?? [];
  const streak = data?.streak ?? 0;
  const maxStreak = data?.maxStreak ?? 0;

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.trunc((100 * completedCount) / tasks.length);
  }, [completedCount, tasks.length]);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    fetchDailyTasks().catch(() => null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderTasks = () => {
    if (isMutating) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress size={22} />
        </Stack>
      );
    }

    if (!tasks.length) {
      return (
        <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 6 }}>
          <Avatar sx={{ bgcolor: 'background.level1', color: 'text.secondary', width: 56, height: 56 }}>
            <IconifyIcon icon="mdi:fire-off" sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            No daily tasks yet
          </Typography>
        </Stack>
      );
    }

    return (
      <SimpleBar disableHorizontal>
        <List disablePadding>
          {tasks.map((task, index) => {
            const paletteColor = taskColorMap[task.type] ?? 'primary';
            const icon = taskIconMap[task.type] ?? getKepIcon('practice');

            return (
              <Box component="li" key={`${task.description}-${index}`}>
                <ListItem alignItems="flex-start" sx={{ py: 1.25, px: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: `${paletteColor}.lighter`,
                        color: `${paletteColor}.main`,
                        width: 44,
                        height: 44,
                      }}
                    >
                      <IconifyIcon icon={icon} sx={{ fontSize: 22 }} />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle2" color="text.primary">
                          {task.description}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
                          <Typography variant="caption" fontWeight={700} color="text.primary">
                            {task.kepcoin}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        {task.completed ? (
                          <Chip
                            size="small"
                            color="success"
                            label="Completed"
                            icon={<IconifyIcon icon="material-symbols:check-circle-outline-rounded" />}
                          />
                        ) : (
                          <Chip size="small" color="primary" label={`${task.progress}/${task.total}`} />
                        )}
                      </Stack>
                    }
                    sx={{ mr: 1.5 }}
                  />
                </ListItem>
                {index < tasks.length - 1 && <Divider component="div" />}
              </Box>
            );
          })}
        </List>
      </SimpleBar>
    );
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconifyIcon
            icon={getKepIcon('streak')}
            sx={{ fontSize: type === 'slim' ? 18 : 22, color: 'warning.main' }}
          />
          {type === 'default' && (
            <Stack spacing={0.25} alignItems="flex-start">
              <Typography variant="caption" color="text.secondary" lineHeight={1}>
                Streak
              </Typography>
              <Typography variant="subtitle2" color="text.primary" lineHeight={1.2} fontWeight={700}>
                {streak}
              </Typography>
            </Stack>
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
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            p: 0,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box>
            <Typography variant="h6">Daily tasks</Typography>
            <Typography variant="caption" color="text.secondary">
              Complete tasks to keep your streak alive
            </Typography>
          </Box>

          <Chip
            color="primary"
            size="small"
            label={`${tasks.length} tasks`}
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>{renderTasks()}</Box>

        <Divider />

        <Stack spacing={1} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {progress}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Streak: {streak} {maxStreak ? `/ Best ${maxStreak}` : ''}
          </Typography>
        </Stack>
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
