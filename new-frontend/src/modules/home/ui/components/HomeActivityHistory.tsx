import { Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TFunction, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByUsername, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import type { KepIconName } from 'shared/config/icons';
import type { HomeUserActivityHistory, HomeUserActivityHistoryItem } from '../../domain/entities/home.entity';

const SKELETON_ITEMS = 3;

interface HomeActivityHistoryProps {
  username?: string | null;
  history?: HomeUserActivityHistory | null;
  isLoading?: boolean;
}

type ActivityType = HomeUserActivityHistoryItem['activityType'];

type ActivityText = {
  primary?: string;
  secondary?: string;
};

const ACTIVITY_ICON_MAP: Record<ActivityType, KepIconName> = {
  problem_attempt_summary: 'problem',
  challenge_summary: 'challenge',
  project_attempt_summary: 'project',
  test_pass_summary: 'test',
  contest_participation: 'contest',
  arena_participation: 'arena',
  daily_activity: 'todo',
  hard_problem_solved: 'problem',
  achievement_unlocked: 'todo',
  daily_task_completed: 'todo',
};

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const parseString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return undefined;
};

const withFallback = (value?: string): string => value ?? '—';

const formatDelta = (value?: number): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value > 0) {
    return `+${value}`;
  }
  return value.toString();
};

const compact = (values: Array<string | undefined>): string | undefined => {
  const filtered = values.filter((value): value is string => Boolean(value));
  return filtered.length ? filtered.join(' · ') : undefined;
};

const getActivityTexts = (activity: HomeUserActivityHistoryItem, t: TFunction<'translation'>): ActivityText => {
  const payload = (activity.payload ?? {}) as Record<string, unknown>;

  switch (activity.activityType) {
    case 'problem_attempt_summary':
      return {
        primary: t('homePage.activityHistory.types.problemAttemptSummary.description', {
          accepted: parseNumber(payload.accepted) ?? 0,
          total: parseNumber(payload.total) ?? 0,
        }),
      };
    case 'challenge_summary': {
      const wins = parseNumber(payload.wins);
      const draws = parseNumber(payload.draws);
      const losses = parseNumber(payload.losses);
      return {
        primary: t('homePage.activityHistory.types.challengeSummary.description'),
        secondary: compact([
          wins !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.wins', { value: wins })
            : undefined,
          draws !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.draws', { value: draws })
            : undefined,
          losses !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.losses', { value: losses })
            : undefined,
        ]),
      };
    }
    case 'project_attempt_summary':
      return {
        primary: t('homePage.activityHistory.types.projectAttemptSummary.description', {
          checked: parseNumber(payload.checked) ?? 0,
          total: parseNumber(payload.total) ?? 0,
        }),
      };
    case 'test_pass_summary':
      return {
        primary: t('homePage.activityHistory.types.testPassSummary.description', {
          completed: parseNumber(payload.completed) ?? 0,
          total: parseNumber(payload.total) ?? 0,
          solved: parseNumber(payload.solved) ?? 0,
        }),
      };
    case 'contest_participation': {
      const title = parseString(payload.contestTitle);
      const rank = parseNumber(payload.rank);
      const delta = parseNumber(payload.delta);
      const ratingBefore = parseNumber(payload.ratingBefore);
      const ratingAfter = parseNumber(payload.ratingAfter);
      const bonus = parseNumber(payload.bonus);
      return {
        primary: t('homePage.activityHistory.types.contestParticipation.description', {
          title: withFallback(title),
        }),
        secondary: compact([
          t('homePage.activityHistory.types.contestParticipation.rank', {
            rank: rank ?? t('homePage.activityHistory.types.contestParticipation.noRank'),
          }),
          delta !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.ratingChange', {
                delta: formatDelta(delta),
              })
            : undefined,
          ratingBefore !== undefined && ratingAfter !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.rating', {
                before: ratingBefore,
                after: ratingAfter,
              })
            : undefined,
          bonus !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.bonus', { bonus })
            : undefined,
        ]),
      };
    }
    case 'arena_participation': {
      const title = parseString(payload.title);
      const points = parseNumber(payload.points);
      const rank = parseNumber(payload.rank);
      const finishTime = parseString(payload.finishTime)
        ? dayjs(payload.finishTime as string).format('MMM DD, YYYY HH:mm')
        : undefined;
      return {
        primary: t('homePage.activityHistory.types.arenaParticipation.description', {
          title: withFallback(title),
        }),
        secondary: compact([
          points !== undefined
            ? t('homePage.activityHistory.types.arenaParticipation.points', { points })
            : undefined,
          rank !== undefined
            ? t('homePage.activityHistory.types.arenaParticipation.rank', { rank })
            : undefined,
          finishTime
            ? t('homePage.activityHistory.types.arenaParticipation.finishTime', { time: finishTime })
            : undefined,
        ]),
      };
    }
    case 'daily_activity': {
      const note = parseString(payload.note);
      return {
        primary: t('homePage.activityHistory.types.dailyActivity.description', {
          value: parseNumber(payload.value) ?? 0,
        }),
        secondary: note
          ? t('homePage.activityHistory.types.dailyActivity.note', { note })
          : undefined,
      };
    }
    case 'hard_problem_solved':
      return {
        primary: t('homePage.activityHistory.types.hardProblemSolved.description', {
          title: withFallback(parseString(payload.title)),
          difficulty: withFallback(parseString(payload.difficulty)),
        }),
        secondary: parseNumber(payload.problemId) !== undefined
          ? t('homePage.activityHistory.types.hardProblemSolved.problem', {
              id: parseNumber(payload.problemId),
            })
          : undefined,
      };
    case 'achievement_unlocked':
      return {
        primary: t('homePage.activityHistory.types.achievementUnlocked.description', {
          message: withFallback(parseString(payload.message)),
        }),
      };
    case 'daily_task_completed': {
      const taskDescription = parseString(payload.description);
      return {
        primary: t('homePage.activityHistory.types.dailyTaskCompleted.description', {
          type: withFallback(parseString(payload.taskType)),
        }),
        secondary: taskDescription
          ? t('homePage.activityHistory.types.dailyTaskCompleted.task', { description: taskDescription })
          : undefined,
      };
    }
    default:
      return {};
  }
};

const HomeActivityHistory = ({ username, history, isLoading }: HomeActivityHistoryProps) => {
  const { t } = useTranslation();
  const activities = history?.data ?? [];
  const viewAllHref = username ? getResourceByUsername(resources.UserProfileActivityHistory, username) : undefined;
  const showEmpty = !isLoading && activities.length === 0;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="h6" fontWeight={600}>
          {t('homePage.activityHistory.title')}
        </Typography>

        {viewAllHref ? (
          <Button component={RouterLink} to={viewAllHref} variant="outlined" size="small">
            {t('homePage.activityHistory.viewAll')}
          </Button>
        ) : null}
      </Stack>

      {isLoading ? (
        <Stack spacing={2}>
          {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={92} />
          ))}
        </Stack>
      ) : showEmpty ? (
        <Typography variant="body2" color="text.secondary">
          {t('homePage.activityHistory.empty')}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {activities.map((activity) => {
            const texts = getActivityTexts(activity, t);
            const icon = ACTIVITY_ICON_MAP[activity.activityType];
            const recordedAt = dayjs(activity.recordedFor);
            const label = activity.activityTypeDisplay || activity.user?.username || t('homePage.activityHistory.defaultLabel');

            return (
              <Paper
                key={activity.id ?? `${activity.activityType}-${activity.recordedFor}`}
                background={2}
                sx={{
                  p: 2,
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      flexShrink: 0,
                    }}
                  >
                    <KepIcon name={icon} fontSize={28} color="primary.main" />
                  </Stack>

                  <Stack spacing={0.5} flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {label}
                    </Typography>
                    {texts.primary ? (
                      <Typography variant="body2">{texts.primary}</Typography>
                    ) : null}
                    {texts.secondary ? (
                      <Typography variant="body2" color="text.secondary">
                        {texts.secondary}
                      </Typography>
                    ) : null}
                    <Typography variant="caption" color="text.disabled">
                      {recordedAt.format('MMM DD, YYYY · HH:mm')}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default HomeActivityHistory;
