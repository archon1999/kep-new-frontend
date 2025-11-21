import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { ProblemAttempt } from '../../domain/entities/problem.entity.ts';

interface ProblemsAttemptsCardProps {
  attempts?: ProblemAttempt[] | null;
}

const ProblemsAttemptsCard = ({ attempts }: ProblemsAttemptsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6">{t('problems.lastAttemptsTitle')}</Typography>
          {(attempts ?? []).map((attempt) => (
            <Stack
              key={attempt.id}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing={0.5} direction="column" sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {attempt.problemTitle}
                </Typography>
                {attempt.createdAt && (
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(attempt.createdAt).format('DD MMM, HH:mm')}
                  </Typography>
                )}
              </Stack>
              <Chip color="primary" label={attempt.verdict || t('problems.verdictUnknown')} size="small" />
            </Stack>
          ))}
          {(attempts ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('problems.noAttempts')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsAttemptsCard;
