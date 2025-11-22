import { Chip, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemDetail } from '../../../domain/entities/problem.entity';

interface ProblemHeaderProps {
  problem: ProblemDetail;
  selectedDifficultyColor: string;
}

export const ProblemHeader = ({ problem, selectedDifficultyColor }: ProblemHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="h5" fontWeight={800} sx={{ mr: 1 }}>
            {problem.id}. {problem.title}
          </Typography>
          <Chip label={problem.difficultyTitle} color={selectedDifficultyColor as any} size="small" />
          <Chip
            label={`${t('problems.detail.timeLimit')}: ${
              problem.timeLimit ?? problem.availableLanguages?.[0]?.timeLimit ?? 0
            } ms`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`${t('problems.detail.memoryLimit')}: ${
              problem.memoryLimit ?? problem.availableLanguages?.[0]?.memoryLimit ?? 0
            } MB`}
            variant="outlined"
            size="small"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
