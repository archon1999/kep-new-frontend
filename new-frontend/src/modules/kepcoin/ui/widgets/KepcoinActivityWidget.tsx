import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Button,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  KepcoinEarnHistoryItem,
  KepcoinEarnType,
  KepcoinSpendHistoryItem,
  KepcoinSpendType,
} from '../../domain/entities/kepcoin.entity';
import { HistoryView } from '../types';

type HistoryItem = KepcoinEarnHistoryItem | KepcoinSpendHistoryItem;

const earnTypeKeyMap: Record<KepcoinEarnType, string> = {
  [KepcoinEarnType.WroteBlog]: 'kepcoinPage.earnTypes.wroteBlog',
  [KepcoinEarnType.WroteProblemSolution]: 'kepcoinPage.earnTypes.wroteProblemSolution',
  [KepcoinEarnType.LoyaltyBonus]: 'kepcoinPage.earnTypes.loyaltyBonus',
  [KepcoinEarnType.BonusFromAdmin]: 'kepcoinPage.earnTypes.bonusFromAdmin',
  [KepcoinEarnType.DailyActivity]: 'kepcoinPage.earnTypes.dailyActivity',
  [KepcoinEarnType.DailyTaskCompletion]: 'kepcoinPage.earnTypes.dailyTaskCompletion',
  [KepcoinEarnType.DailyProblemsRatingWin]: 'kepcoinPage.earnTypes.dailyRatingWinner',
  [KepcoinEarnType.WeeklyProblemsRatingWin]: 'kepcoinPage.earnTypes.weeklyRatingWinner',
  [KepcoinEarnType.MonthlyProblemsRatingWin]: 'kepcoinPage.earnTypes.monthlyRatingWinner',
  [KepcoinEarnType.ContestParticipated]: 'kepcoinPage.earnTypes.contestParticipant',
  [KepcoinEarnType.ArenaParticipated]: 'kepcoinPage.earnTypes.arenaParticipant',
  [KepcoinEarnType.TournamentParticipated]: 'kepcoinPage.earnTypes.tournamentParticipant',
  [KepcoinEarnType.ProjectTaskComplete]: 'kepcoinPage.earnTypes.projectTask',
};

const spendTypeKeyMap: Record<KepcoinSpendType, string> = {
  [KepcoinSpendType.AttemptView]: 'kepcoinPage.spendTypes.attemptView',
  [KepcoinSpendType.AttemptTestView]: 'kepcoinPage.spendTypes.attemptTestView',
  [KepcoinSpendType.ProblemSolution]: 'kepcoinPage.spendTypes.problemSolution',
  [KepcoinSpendType.DoubleRating]: 'kepcoinPage.spendTypes.doubleRating',
  [KepcoinSpendType.CoverPhotoChange]: 'kepcoinPage.spendTypes.coverPhoto',
  [KepcoinSpendType.Course]: 'kepcoinPage.spendTypes.course',
  [KepcoinSpendType.StudyPlan]: 'kepcoinPage.spendTypes.studyPlan',
  [KepcoinSpendType.CodeEditorTesting]: 'kepcoinPage.spendTypes.codeEditorTesting',
  [KepcoinSpendType.SaveRating]: 'kepcoinPage.spendTypes.saveRating',
  [KepcoinSpendType.TestPass]: 'kepcoinPage.spendTypes.testPass',
  [KepcoinSpendType.UserContestCreate]: 'kepcoinPage.spendTypes.userContestCreate',
  [KepcoinSpendType.Project]: 'kepcoinPage.spendTypes.project',
  [KepcoinSpendType.StreakFreeze]: 'kepcoinPage.spendTypes.streakFreeze',
  [KepcoinSpendType.VirtualContest]: 'kepcoinPage.spendTypes.virtualContest',
  [KepcoinSpendType.UnratedContest]: 'kepcoinPage.spendTypes.unratedContest',
  [KepcoinSpendType.AnswerForInput]: 'kepcoinPage.spendTypes.answerForInput',
  [KepcoinSpendType.CheckSamples]: 'kepcoinPage.spendTypes.checkSamples',
  [KepcoinSpendType.Merch]: 'kepcoinPage.spendTypes.merch',
};

const getDetailText = (detail?: unknown): string | null => {
  if (!detail) {
    return null;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (typeof detail === 'number') {
    return detail.toString();
  }

  if (typeof detail === 'object') {
    const possible = detail as Record<string, any>;

    if (typeof possible.description === 'string') {
      return possible.description;
    }

    if (typeof possible.date === 'string') {
      return possible.date;
    }

    if (possible.contest && typeof possible.contest.title === 'string') {
      return possible.contest.title;
    }

    if (possible.arena && typeof possible.arena.title === 'string') {
      return possible.arena.title;
    }

    if (possible.tournament && typeof possible.tournament.title === 'string') {
      return possible.tournament.title;
    }

    if (typeof possible.title === 'string') {
      return possible.title;
    }
  }

  return null;
};

const getHistoryDescription = (
  type: HistoryView,
  item: HistoryItem,
  translate: (key: string, params?: Record<string, unknown>) => string,
) => {
  const key = type === 'earns'
    ? earnTypeKeyMap[(item as KepcoinEarnHistoryItem).earnType]
    : spendTypeKeyMap[(item as KepcoinSpendHistoryItem).spendType];
  const base = key ? translate(key) : translate('kepcoinPage.history.defaultLabel');
  const detail = getDetailText(item.detail);

  if (detail) {
    return translate('kepcoinPage.history.detail', { base, detail });
  }

  return base;
};

interface KepcoinActivityWidgetProps {
  view: HistoryView;
  onViewChange: (_: unknown, next: HistoryView | null) => void;
  isLoading: boolean;
  error?: unknown;
  historyItems: HistoryItem[];
  pagesCount: number;
  page: number;
  onPageChange: (_: unknown, nextPage: number) => void;
  onRetry: () => void;
}

const KepcoinActivityWidget = ({
  view,
  onViewChange,
  isLoading,
  error,
  historyItems,
  pagesCount,
  page,
  onPageChange,
  onRetry,
}: KepcoinActivityWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
        <Typography variant="h5" fontWeight={700}>
          {t('kepcoinPage.history.title')}
        </Typography>
        <ToggleButtonGroup value={view} exclusive onChange={onViewChange} size="small">
          <ToggleButton value="earns">{t('kepcoinPage.history.tabs.earns')}</ToggleButton>
          <ToggleButton value="spends">{t('kepcoinPage.history.tabs.spends')}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {isLoading ? (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Stack key={index} direction="column" spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Skeleton variant="rounded" width={120} height={28} />
                <Skeleton variant="text" width={140} />
              </Stack>
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="55%" />
              <Divider />
            </Stack>
          ))}
        </Stack>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              {t('kepcoinPage.history.retry')}
            </Button>
          }
        >
          {t('kepcoinPage.history.error')}
        </Alert>
      ) : historyItems.length === 0 ? (
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {t('kepcoinPage.history.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('kepcoinPage.history.emptySubtitle')}
          </Typography>
        </Stack>
      ) : (
        <Stack direction="column" spacing={2} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
          {historyItems.map((item) => (
            <Stack key={item.id} spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconifyIcon icon="solar:coins-stacks-linear" fontSize={24} color="warning.main" />
                  <Typography variant="h6" color={view === 'earns' ? 'success.main' : 'error.main'}>
                    {`${view === 'earns' ? '+' : '-'}${item.amount}`}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.happenedAt ? dayjs(item.happenedAt).format('MMM D, YYYY · HH:mm') : t('kepcoinPage.history.noDate')}
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={600}>
                {getHistoryDescription(view, item, t)}
              </Typography>
              {item.note && (
                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.history.note', { value: item.note })}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      )}

      {pagesCount > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination count={pagesCount} page={page} onChange={onPageChange} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default KepcoinActivityWidget;
