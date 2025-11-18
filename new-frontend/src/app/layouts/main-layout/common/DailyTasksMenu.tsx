import { MouseEvent, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Popover,
  Stack,
  Typography,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import { useAuth } from 'app/providers/AuthProvider';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import fire1 from 'shared/assets/images/icons/fire-1.webp';
import fire2 from 'shared/assets/images/icons/fire-2.webp';
import fire3 from 'shared/assets/images/icons/fire-3.webp';
import fire4 from 'shared/assets/images/icons/fire-4.webp';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';

enum DailyTaskType {
  Problem = 1,
  Test = 2,
  Challenge = 3,
}

type DailyTask = {
  type: DailyTaskType;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
};

type DailyTasksResponse = {
  streak: number;
  maxStreak: number;
  dailyTasks: DailyTask[];
};

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const taskIconMap: Record<DailyTaskType, string> = {
  [DailyTaskType.Problem]: 'material-symbols:code',
  [DailyTaskType.Test]: 'material-symbols:quiz-outline-rounded',
  [DailyTaskType.Challenge]: 'material-symbols:flag-rounded',
};

const getStreakIcon = (streak: number, maxStreak: number) => {
  if (streak === 0) {
    return maxStreak === 0 ? fire1 : fire2;
  }

  if (streak < 7) {
    return fire3;
  }

  return fire4;
};

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { currentUser } = useAuth();
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { data, isLoading, mutate } = useSWR<DailyTasksResponse>(
    currentUser ? ['/api/daily-tasks', { method: 'get' }] : null,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const dailyTasks = data?.dailyTasks ?? [];
  const completedTasks = useMemo(
    () => dailyTasks.filter((task) => task.completed).length,
    [dailyTasks],
  );

  const handleClose = () => setAnchorEl(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    mutate();
  };

  if (!currentUser) {
    return null;
  }

  const streakValue = data?.streak ?? 0;
  const maxStreak = data?.maxStreak ?? 0;
  const streakIcon = getStreakIcon(streakValue, maxStreak);
  const progress = dailyTasks.length
    ? Math.round((completedTasks / dailyTasks.length) * 100)
    : 0;
  const open = Boolean(anchorEl);

  const renderTasks = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={20} />
        </Stack>
      );
    }

    if (!dailyTasks.length) {
      return (
        <Stack alignItems="center" justifyContent="center" spacing={1.25} sx={{ py: 4 }}>
          <Avatar sx={{ bgcolor: 'background.level1', color: 'text.secondary', width: 48, height: 48 }}>
            <IconifyIcon icon="material-symbols:checklist-rounded" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            No daily tasks for now
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack direction="column" component="ul" spacing={1} sx={{ px: 1.5, py: 1.5, m: 0 }}>
        {dailyTasks.map((task, index) => (
          <Stack
            component="li"
            key={`${task.type}-${task.description}-${index}`}
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ p: 1.25, borderRadius: 2, bgcolor: 'background.level1' }}
          >
            <Avatar
              variant="circular"
              sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 44, height: 44 }}
            >
              <IconifyIcon icon={taskIconMap[task.type]} sx={{ fontSize: 22 }} />
            </Avatar>

            <Stack direction="column" spacing={1}>
              <Stack spacing={0.75} flex={1} minWidth={0}>
                <Typography variant="subtitle2" noWrap title={task.description}>
                  {task.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 16, height: 16 }} />
                    <Typography variant="caption" fontWeight={700} color="text.primary">
                      {task.kepcoin}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Box>
                {task.completed ? (
                  <Chip
                    size="small"
                    color="success"
                    variant="soft"
                    label="Completed"
                    icon={<IconifyIcon icon="material-symbols:check-circle-rounded" sx={{ fontSize: 16 }} />}
                  />
                ) : (
                  <Chip
                    size="small"
                    color="primary"
                    variant="soft"
                    label={`${task.progress}/${task.total}`}
                  />
                )}
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
        sx={{ px: 1.5 }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box
            component="img"
            src={streakIcon}
            alt="Daily streak"
            sx={{ width: type === 'slim' ? 18 : 22, height: type === 'slim' ? 18 : 22 }}
          />
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {streakValue}
          </Typography>
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
            width: 380,
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
              Keep your streak growing
            </Typography>
          </Box>
          <Chip color="secondary" size="small" label={`${dailyTasks.length} tasks`} sx={{ borderRadius: 1 }} />
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>{renderTasks()}</Box>

        <Divider />

        <Stack spacing={0.75} sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Completed
          </Typography>
          <Box sx={{ position: 'relative', borderRadius: 999, overflow: 'hidden' }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 'inherit' }} />
            <Typography
              variant="caption"
              color="common.white"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                textShadow: '0 0 6px rgba(0,0,0,0.35)',
              }}
            >
              {dailyTasks.length ? `${completedTasks}/${dailyTasks.length}` : '--'}
            </Typography>
          </Box>
        </Stack>
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
