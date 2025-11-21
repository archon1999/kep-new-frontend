import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DifficultyBreakdownItem, ProblemsRatingSummary } from '../../domain';

interface Props {
  summary: ProblemsRatingSummary | null | undefined;
  loading?: boolean;
}

const breakdown: DifficultyBreakdownItem[] = [
  { key: 'beginner', totalKey: 'allBeginner', labelKey: 'problems.difficulties.beginner' },
  { key: 'basic', totalKey: 'allBasic', labelKey: 'problems.difficulties.basic' },
  { key: 'normal', totalKey: 'allNormal', labelKey: 'problems.difficulties.normal' },
  { key: 'medium', totalKey: 'allMedium', labelKey: 'problems.difficulties.medium' },
  { key: 'advanced', totalKey: 'allAdvanced', labelKey: 'problems.difficulties.advanced' },
  { key: 'hard', totalKey: 'allHard', labelKey: 'problems.difficulties.hard' },
  { key: 'extremal', totalKey: 'allExtremal', labelKey: 'problems.difficulties.extremal' },
];

const ProblemsDifficultiesCard = ({ summary, loading }: Props) => {
  const { t } = useTranslation();

  const totals = useMemo(
    () =>
      breakdown.map((item) => {
        const solved = Number(summary?.[item.key] ?? 0);
        const total = Number(summary?.[item.totalKey] ?? 0) || 0;
        const percent = total ? Math.round((solved / total) * 100) : 0;
        return { ...item, solved, total, percent };
      }),
    [summary],
  );

  return (
    <Card variant="outlined">
      {loading ? <LinearProgress /> : null}
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6" fontWeight={800}>
            {t('problems.difficulties.title')}
          </Typography>

          <Stack spacing={1.5} direction="column">
            {totals.map((item) => (
              <Stack key={item.key} spacing={0.5} direction="column">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{t(item.labelKey)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('problems.difficulties.progress', { solved: item.solved, total: item.total })}
                  </Typography>
                </Stack>
                <LinearProgress value={item.percent} variant="determinate" />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsDifficultiesCard;
