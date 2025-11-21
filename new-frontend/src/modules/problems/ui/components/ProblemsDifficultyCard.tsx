import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity.ts';

interface ProblemsDifficultyCardProps {
  rating?: ProblemsRatingRow | null;
}

const difficultyFields = [
  { key: 'beginner', labelKey: 'problems.difficulty.beginner' },
  { key: 'basic', labelKey: 'problems.difficulty.basic' },
  { key: 'normal', labelKey: 'problems.difficulty.normal' },
  { key: 'medium', labelKey: 'problems.difficulty.medium' },
  { key: 'advanced', labelKey: 'problems.difficulty.advanced' },
  { key: 'hard', labelKey: 'problems.difficulty.hard' },
  { key: 'extremal', labelKey: 'problems.difficulty.extremal' },
] as const;

const ProblemsDifficultyCard = ({ rating }: ProblemsDifficultyCardProps) => {
  const { t } = useTranslation();

  const totalSolved = Number(rating?.solved ?? 0) || 1;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6">{t('problems.difficultyTitle')}</Typography>
          {difficultyFields.map((field) => {
            const solved = Number((rating as any)?.[field.key] ?? 0);
            return (
              <Stack key={field.key} spacing={0.5} direction="column">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{t(field.labelKey)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {solved} {t('problems.solvedSuffix')}
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={(solved / totalSolved) * 100} />
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsDifficultyCard;
