import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge.tsx';
import { apiClient } from 'shared/api/http/apiClient.ts';
import { ApiDailyTasksListResult } from 'shared/api/orval/generated/endpoints/index.ts';

interface DailyTask {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  progress?: number;
  target?: number;
  reward?: number;
}

const normalizeTasks = (response: ApiDailyTasksListResult | undefined): DailyTask[] => {
  if (!response) return [];

  const rawTasks = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: unknown }).data)
      ? (response as { data: unknown[] }).data
      : Array.isArray((response as { results?: unknown }).results)
        ? (response as { results: unknown[] }).results
        : [];

  return rawTasks.map((task, index) => {
    const normalizedTask = task as Record<string, unknown>;
    const progressValue = Number(normalizedTask.progress ?? normalizedTask.completed ?? 0);
    const targetValue = Number(normalizedTask.target ?? normalizedTask.total ?? normalizedTask.goal ?? 0);

    return {
      id: (normalizedTask.id as string | number | undefined) ?? index,
      title:
        (normalizedTask.title as string | undefined) ||
        (normalizedTask.name as string | undefined) ||
        (normalizedTask.type as string | undefined) ||
        'Daily task',
      description:
        (normalizedTask.description as string | undefined) ||
        (normalizedTask.body as string | undefined) ||
        undefined,
      completed:
        Boolean(normalizedTask.isCompleted ?? normalizedTask.completed) ||
        (targetValue > 0 && progressValue >= targetValue),
      progress: Number.isFinite(progressValue) ? progressValue : undefined,
      target: Number.isFinite(targetValue) && targetValue > 0 ? targetValue : undefined,
      reward: (normalizedTask.reward as number | undefined) ?? (normalizedTask.kepcoin as number | undefined),
    };
  });
};

interface DailyTasksMenuProps {
  type?: 'default' | 'slim';
}

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const open = Boolean(anchorEl);

  const incompleteCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.apiDailyTasksList();
      setTasks(normalizeTasks(response));
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !hasFetched) {
      fetchTasks();
      setHasFetched(true);
    }
  }, [fetchTasks, hasFetched, open]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <OutlinedBadge
        color="error"
        badgeContent={incompleteCount}
        overlap="circular"
        invisible={!incompleteCount}
        className={badgeClasses.root}
      >
        <IconButton
          color={open ? 'primary' : 'inherit'}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label="Daily tasks"
          size={type === 'slim' ? 'small' : 'medium'}
        >
          <IconifyIcon icon="material-symbols:checklist-rtl" />
        </IconButton>
      </OutlinedBadge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { className: paperClasses.root, sx: { width: 360, p: 2 } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1} px={0.5}>
          <Typography variant="subtitle1">Daily tasks</Typography>
          <IconButton
            aria-label="Refresh daily tasks"
            size="small"
            disabled={isLoading}
            onClick={fetchTasks}
          >
            <IconifyIcon icon="material-symbols:refresh" />
          </IconButton>
        </Stack>

        <Divider />

        {isLoading ? (
          <Stack alignItems="center" py={4} gap={1}>
            <IconifyIcon icon="line-md:loading-twotone-loop" />
            <Typography variant="body2" color="text.secondary">
              Loading daily tasks...
            </Typography>
          </Stack>
        ) : tasks.length === 0 ? (
          <Stack alignItems="center" py={3}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Daily tasks are unavailable right now.
            </Typography>
          </Stack>
        ) : (
          <List disablePadding sx={{ pt: 1 }}>
            {tasks.map((task, index) => {
              const progressValue =
                task.progress !== undefined && task.target ? Math.min((task.progress / task.target) * 100, 100) : undefined;

              return (
                <Fragment key={task.id}>
                  <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconifyIcon
                            icon={task.completed ? 'material-symbols:check-circle' : 'material-symbols:circle-outline'}
                            color={task.completed ? 'success.main' : 'action.disabled'}
                          />
                          <Typography variant="subtitle2" color={task.completed ? 'text.secondary' : 'text.primary'}>
                            {task.title}
                          </Typography>
                          {typeof task.reward === 'number' && (
                            <Typography variant="caption" color="primary.main" ml="auto">
                              +{task.reward} Kepcoin
                            </Typography>
                          )}
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} mt={0.5}>
                          {task.description && (
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                          )}
                          {progressValue !== undefined && (
                            <Box>
                              <LinearProgress
                                variant="determinate"
                                value={progressValue}
                                sx={{ height: 6, borderRadius: 1, mb: 0.5 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(progressValue)}% completed
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < tasks.length - 1 && <Divider component="li" />}
                </Fragment>
              );
            })}
          </List>
        )}
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
