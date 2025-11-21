import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DifficultiesBreakdown } from '../../domain/entities/stats.entity.ts';

interface ProblemsDifficultiesCardProps {
  difficulties?: DifficultiesBreakdown;
  isLoading?: boolean;
}

const DifficultyRow = ({ label, solved, total }: { label: string; solved: number; total: number }) => (
  <Stack spacing={0.5}>
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2">{`${solved}/${total}`}</Typography>
    </Stack>
    <LinearProgress variant="determinate" value={total ? (solved / total) * 100 : 0} />
  </Stack>
);

const ProblemsDifficultiesCard = ({ difficulties, isLoading }: ProblemsDifficultiesCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('problems.difficultiesTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.difficultiesSubtitle')}
            </Typography>
          </Stack>

          {isLoading && <LinearProgress />}

          {!isLoading && (
            <Stack spacing={1.5}>
              <DifficultyRow
                label={t('problems.difficulty.beginner')}
                solved={difficulties?.beginner ?? 0}
                total={difficulties?.allBeginner ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.basic')}
                solved={difficulties?.basic ?? 0}
                total={difficulties?.allBasic ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.normal')}
                solved={difficulties?.normal ?? 0}
                total={difficulties?.allNormal ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.medium')}
                solved={difficulties?.medium ?? 0}
                total={difficulties?.allMedium ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.advanced')}
                solved={difficulties?.advanced ?? 0}
                total={difficulties?.allAdvanced ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.hard')}
                solved={difficulties?.hard ?? 0}
                total={difficulties?.allHard ?? 0}
              />
              <DifficultyRow
                label={t('problems.difficulty.extremal')}
                solved={difficulties?.extremal ?? 0}
                total={difficulties?.allExtremal ?? 0}
              />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsDifficultiesCard;
