import { Card, CardContent, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProblemsRatingSummary } from '../../domain/entities/problems-rating.entity.ts';

interface ProblemsDifficultiesCardProps {
  summary?: ProblemsRatingSummary | null;
  loading?: boolean;
}

const ProblemsDifficultiesCard = ({ summary, loading }: ProblemsDifficultiesCardProps) => {
  const { t } = useTranslation();

  const difficulties = useMemo(
    () => [
      { key: 'beginner' as const, totalKey: 'allBeginner' as const, label: t('problems.difficultyBeginner') },
      { key: 'basic' as const, totalKey: 'allBasic' as const, label: t('problems.difficultyBasic') },
      { key: 'normal' as const, totalKey: 'allNormal' as const, label: t('problems.difficultyNormal') },
      { key: 'medium' as const, totalKey: 'allMedium' as const, label: t('problems.difficultyMedium') },
      { key: 'advanced' as const, totalKey: 'allAdvanced' as const, label: t('problems.difficultyAdvanced') },
      { key: 'hard' as const, totalKey: 'allHard' as const, label: t('problems.difficultyHard') },
      { key: 'extremal' as const, totalKey: 'allExtremal' as const, label: t('problems.difficultyExtremal') },
    ],
    [t],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6">{t('problems.difficultiesTitle')}</Typography>
          {loading
            ? difficulties.map((difficulty) => <Skeleton key={difficulty.key} height={36} />)
            : difficulties.map((difficulty) => {
                const solved = summary?.[difficulty.key] ?? 0;
                const total = (summary as any)?.[difficulty.totalKey] ?? solved;
                const progress = total ? Math.min(100, Math.round((solved / total) * 100)) : 0;
                return (
                  <Stack key={difficulty.key} direction="column" spacing={0.5}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="text.primary" fontWeight={600}>
                        {difficulty.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {solved} / {total}
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} />
                  </Stack>
                );
              })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsDifficultiesCard;
