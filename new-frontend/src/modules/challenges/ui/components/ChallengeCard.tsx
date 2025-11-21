import { Box, Card, Chip, Divider, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import type { Challenge } from '../../domain/entities/challenge.entity';
import ChallengePlayerInfo from './ChallengePlayerInfo';

interface ChallengeCardProps {
  challenge: Challenge;
}

const formatFinishedLabel = (finished?: string, fallback?: string) => {
  if (!finished) return fallback;
  const parsed = dayjs(finished);
  if (parsed.isValid()) {
    return parsed.format('MMM D, YYYY HH:mm');
  }
  return finished;
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const { t } = useTranslation();

  const finishedLabel = formatFinishedLabel(challenge.finished, t('challenges.inProgress'));

  return (
    <Card sx={{ p: 2.5, borderRadius: 3 }} elevation={0}>
      <Stack spacing={2}>
        <ChallengePlayerInfo player={challenge.playerFirst} opponentResult={challenge.playerSecond.result} />
        <Divider sx={{ my: 1 }} />
        <ChallengePlayerInfo player={challenge.playerSecond} opponentResult={challenge.playerFirst.result} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<KepIcon name="challenge-time" fontSize={18} />}
              label={t('challenges.timeLabel', { seconds: challenge.timeSeconds })}
              variant="outlined"
            />
            <Chip
              icon={<KepIcon name="challenge-task" fontSize={18} />}
              label={t('challenges.questionsLabel', { count: challenge.questionsCount })}
              variant="outlined"
            />
            <Chip
              color={challenge.rated ? 'primary' : 'default'}
              label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
              variant={challenge.rated ? 'filled' : 'outlined'}
            />
          </Stack>

          <Box>
            <Chip
              icon={<KepIcon name="challenge-time" fontSize={18} />}
              color={challenge.finished ? 'info' : 'success'}
              label={finishedLabel}
              variant="outlined"
            />
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ChallengeCard;
