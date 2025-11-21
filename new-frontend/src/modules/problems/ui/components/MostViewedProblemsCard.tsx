import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Problem } from '../../domain/entities/problem.entity.ts';

interface MostViewedProblemsCardProps {
  problems?: Problem[];
}

const MostViewedProblemsCard = ({ problems }: MostViewedProblemsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6">{t('problems.mostViewedTitle')}</Typography>
          {(problems ?? []).map((problem) => (
            <Stack key={problem.id} spacing={1} direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.25} direction="column">
                <Typography variant="subtitle2" fontWeight={700}>
                  {problem.title}
                </Typography>
                {problem.tags && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {problem.tags.slice(0, 3).map((tag) => (
                      <Chip key={`${problem.id}-${tag.id}`} label={tag.name} size="small" />
                    ))}
                  </Stack>
                )}
              </Stack>
              {problem.difficultyTitle && <Chip label={problem.difficultyTitle} size="small" color="secondary" />}
            </Stack>
          ))}
          {(problems ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('problems.noMostViewed')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MostViewedProblemsCard;
