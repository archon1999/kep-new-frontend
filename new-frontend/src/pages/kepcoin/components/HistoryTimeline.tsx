import { Box, Link, Stack, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import { getResourceById, Resources } from 'shared/lib/resources';
import {
  KepcoinEarn,
  KepcoinEarnType,
  KepcoinSpend,
  KepcoinSpendType,
} from 'modules/kepcoin/domain/entities/kepcoin-history.entity';

interface EarnTimelineProps {
  type: 'earns';
  items: KepcoinEarn[];
}

interface SpendTimelineProps {
  type: 'spends';
  items: KepcoinSpend[];
}

type HistoryTimelineProps = EarnTimelineProps | SpendTimelineProps;

const TimelineList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 12,
    width: 2,
    backgroundColor: theme.palette.divider,
  },
}));

const TimelineItem = styled('li')(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  '&:last-of-type': {
    paddingBottom: 0,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 7,
    top: 8,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.warning.main,
  },
}));

const formatDate = (value: string | null | undefined) => {
  if (!value) return '--';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value;
};

const HistoryTimeline = (props: HistoryTimelineProps) => {
  const { t } = useTranslation();
  const items = props.items;
  const type = props.type;

  const renderEarnDescription = (earn: KepcoinEarn) => {
    const detail = earn.detail ?? {};
    switch (earn.earnType) {
      case KepcoinEarnType.WroteBlog:
        return t('kepcoin.earnTypes.wroteBlog');
      case KepcoinEarnType.WroteProblemSolution:
        return t('kepcoin.earnTypes.problemSolution');
      case KepcoinEarnType.LoyaltyBonus:
        return t('kepcoin.earnTypes.loyaltyBonus');
      case KepcoinEarnType.BonusFromAdmin:
        return t('kepcoin.earnTypes.bonusFromAdmin');
      case KepcoinEarnType.DailyActivity:
        return t('kepcoin.earnTypes.dailyActivity', { date: detail.date ?? t('kepcoin.history.unknownDate') });
      case KepcoinEarnType.DailyTaskCompletion:
        return t('kepcoin.earnTypes.dailyTask', {
          description: detail.description ?? t('kepcoin.history.unknownTitle'),
        });
      case KepcoinEarnType.DailyProblemsRatingWin:
        return t('kepcoin.earnTypes.dailyRating', { date: detail.date ?? t('kepcoin.history.unknownDate') });
      case KepcoinEarnType.WeeklyProblemsRatingWin:
        return t('kepcoin.earnTypes.weeklyRating', { date: detail.date ?? t('kepcoin.history.unknownDate') });
      case KepcoinEarnType.MonthlyProblemsRatingWin:
        return t('kepcoin.earnTypes.monthlyRating', { date: detail.date ?? t('kepcoin.history.unknownDate') });
      case KepcoinEarnType.ContestParticipated:
        return t('kepcoin.earnTypes.contest', {
          title: detail.contest?.title ?? detail.title ?? t('kepcoin.history.unknownTitle'),
        });
      case KepcoinEarnType.ArenaParticipated:
        return t('kepcoin.earnTypes.arena', {
          title: detail.arena?.title ?? detail.title ?? t('kepcoin.history.unknownTitle'),
        });
      case KepcoinEarnType.TournamentParticipated:
        return t('kepcoin.earnTypes.tournament');
      case KepcoinEarnType.ProjectTaskComplete:
        return t('kepcoin.earnTypes.projectTask');
      default:
        return t('kepcoin.history.unknown');
    }
  };

  const getEarnLink = (earn: KepcoinEarn) => {
    const detail = earn.detail ?? {};
    if (earn.earnType === KepcoinEarnType.ContestParticipated && detail.contest?.id) {
      return {
        href: getResourceById(Resources.Contest, detail.contest.id),
        label: detail.contest.title ?? detail.contest.id,
      };
    }

    if (earn.earnType === KepcoinEarnType.ArenaParticipated && detail.arena?.id) {
      return {
        href: getResourceById(Resources.ArenaTournament, detail.arena.id),
        label: detail.arena.title ?? detail.arena.id,
      };
    }

    return null;
  };

  const renderSpendDescription = (spend: KepcoinSpend) => {
    const detail = spend.detail ?? {};
    switch (spend.type) {
      case KepcoinSpendType.AttemptView:
        return t('kepcoin.spendTypes.viewAttempt');
      case KepcoinSpendType.AttemptTestView:
        return t('kepcoin.spendTypes.viewTestAttempt');
      case KepcoinSpendType.ProblemSolution:
        return t('kepcoin.spendTypes.problemSolution');
      case KepcoinSpendType.DoubleRating:
        return t('kepcoin.spendTypes.doubleRating');
      case KepcoinSpendType.CoverPhotoChange:
        return t('kepcoin.spendTypes.coverPhoto');
      case KepcoinSpendType.Course:
        return t('kepcoin.spendTypes.course');
      case KepcoinSpendType.StudyPlan:
        return t('kepcoin.spendTypes.studyPlan');
      case KepcoinSpendType.CodeEditorTesting:
        return t('kepcoin.spendTypes.codeEditor');
      case KepcoinSpendType.SaveRating:
        return t('kepcoin.spendTypes.saveRating');
      case KepcoinSpendType.TestPass:
        return t('kepcoin.spendTypes.testPass');
      case KepcoinSpendType.UserContestCreate:
        return t('kepcoin.spendTypes.createContest');
      case KepcoinSpendType.Project:
        return t('kepcoin.spendTypes.project');
      case KepcoinSpendType.StreakFreeze:
        return t('kepcoin.spendTypes.streakFreeze');
      case KepcoinSpendType.VirtualContest:
        return t('kepcoin.spendTypes.virtualContest');
      case KepcoinSpendType.UnratedContest:
        return t('kepcoin.spendTypes.unratedContest');
      case KepcoinSpendType.AnswerForInput:
        return t('kepcoin.spendTypes.answerForInput');
      case KepcoinSpendType.CheckSamples:
        return t('kepcoin.spendTypes.checkSamples');
      case KepcoinSpendType.Merch:
        return t('kepcoin.spendTypes.merch');
      default:
        return t('kepcoin.history.unknown');
    }
  };

  const getSpendLink = (spend: KepcoinSpend) => {
    const detail = spend.detail ?? {};
    if (
      (spend.type === KepcoinSpendType.AttemptView || spend.type === KepcoinSpendType.AttemptTestView) &&
      detail.attemptId
    ) {
      return {
        href: getResourceById(Resources.Attempt, detail.attemptId),
        label: `#${detail.attemptId}`,
      };
    }

    if (spend.type === KepcoinSpendType.ProblemSolution && detail.problemId) {
      return {
        href: getResourceById(Resources.Problem, detail.problemId),
        label: detail.problemTitle ?? `#${detail.problemId}`,
      };
    }

    if (spend.type === KepcoinSpendType.TestPass && detail.test?.id) {
      return {
        href: getResourceById(Resources.Test, detail.test.id),
        label: detail.test.title ?? `#${detail.test.id}`,
      };
    }

    return null;
  };

  const renderCoverPhoto = (spend: KepcoinSpend) => {
    if (spend.type !== KepcoinSpendType.CoverPhotoChange) {
      return null;
    }

    const cover = spend.detail?.coverPhoto;
    if (!cover) {
      return null;
    }

    return (
      <Box
        component="img"
        src={cover}
        alt="Cover"
        sx={{ mt: 1, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 2 }}
      />
    );
  };

  return (
    <TimelineList>
      {items.map((item, index) => {
        const amount = item.amount;
        const datetime = formatDate(item.datetime);
        const description =
          type === 'earns' ? renderEarnDescription(item as KepcoinEarn) : renderSpendDescription(item as KepcoinSpend);
        const link = type === 'earns' ? getEarnLink(item as KepcoinEarn) : getSpendLink(item as KepcoinSpend);
        const note = item.note;

        return (
          <TimelineItem key={`${type}-${item.datetime}-${amount}-${index}`}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {amount}
                  </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {datetime}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.primary">
                {description}
                {link && (
                  <>
                    :{' '}
                    <Link href={link.href} underline="hover" color="primary.main">
                      {link.label}
                    </Link>
                  </>
                )}
              </Typography>

              {note && (
                <Typography variant="body2" color="text.secondary">
                  {note}
                </Typography>
              )}

              {type === 'spends' && renderCoverPhoto(item as KepcoinSpend)}
            </Stack>
          </TimelineItem>
        );
      })}
    </TimelineList>
  );
};

export default HistoryTimeline;
