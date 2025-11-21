import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LastContest } from '../../domain/entities/problem.entity.ts';

interface LastContestProblemsCardProps {
  contest?: LastContest | null;
}

const LastContestProblemsCard = ({ contest }: LastContestProblemsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5} direction="column">
          <Typography variant="h6">{t('problems.lastContestTitle')}</Typography>
          {contest ? (
            <>
              <Typography variant="subtitle2" fontWeight={700}>
                {contest.title}
              </Typography>
              <Stack spacing={0.75} direction="column">
                {contest.problems.map((problem) => (
                  <Typography key={problem.id} variant="body2">
                    {problem.symbol ? `${problem.symbol}. ${problem.title}` : problem.title}
                  </Typography>
                ))}
              </Stack>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('problems.noLastContest')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LastContestProblemsCard;
