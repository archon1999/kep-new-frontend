import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Challenge } from '../../domain';
import ChallengeUserChip from './ChallengeUserChip.tsx';

interface ChallengeResultsCardProps {
  challenge: Challenge;
}

const resolveResultColor = (value: number) => {
  if (value > 0) return 'success';
  if (value < 0) return 'error';
  return 'warning';
};

const resolveResultLabel = (value: number, t: (key: string) => string) => {
  if (value > 0) return t('challenges.answerCorrect');
  if (value < 0) return t('challenges.answerWrong');
  return t('challenges.answerPending');
};

const ChallengeResultsCard = ({ challenge }: ChallengeResultsCardProps) => {
  const { t } = useTranslation();

  const perQuestionResults = Array.from({ length: challenge.questionsCount }, (_, index) => ({
    first: challenge.playerFirst.results?.[index] ?? -1,
    second: challenge.playerSecond.results?.[index] ?? -1,
  }));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
            <Stack spacing={0.5} direction="column" flex={1}>
              <ChallengeUserChip
                player={challenge.playerFirst}
                highlight={challenge.playerFirst.result > challenge.playerSecond.result}
              />
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack spacing={0.5} direction="column" alignItems="flex-end" flex={1}>
              <ChallengeUserChip
                player={challenge.playerSecond}
                align="right"
                highlight={challenge.playerSecond.result > challenge.playerFirst.result}
              />
            </Stack>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {perQuestionResults.map((result, index) => (
              <Stack key={index} direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  #{index + 1}
                </Typography>
                <Chip
                  size="small"
                  color={resolveResultColor(result.first)}
                  label={resolveResultLabel(result.first, t)}
                  variant="soft"
                />
                <Chip
                  size="small"
                  color={resolveResultColor(result.second)}
                  label={resolveResultLabel(result.second, t)}
                  variant="soft"
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeResultsCard;
