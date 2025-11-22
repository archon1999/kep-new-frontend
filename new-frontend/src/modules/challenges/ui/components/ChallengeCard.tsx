import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import { Challenge, ChallengeStatus } from '../../domain';
import ChallengeUserChip from './ChallengeUserChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

dayjs.extend(relativeTime);

interface ChallengeCardProps {
  challenge: Challenge;
}

const formatResult = (challenge: Challenge, t: (key: string) => string) => {
  if (challenge.status === ChallengeStatus.NotStarted) return t('challenges.statusNotStarted');
  if (challenge.status === ChallengeStatus.Already && !challenge.finished) return t('challenges.statusInProgress');
  if (challenge.playerFirst.result === challenge.playerSecond.result) return t('challenges.statusDraw');
  const winnerTemplate = t('challenges.statusWinner');
  const formatWinner = (username: string) => winnerTemplate.replace('{{username}}', username);
  return challenge.playerFirst.result > challenge.playerSecond.result
    ? formatWinner(challenge.playerFirst.username)
    : formatWinner(challenge.playerSecond.username);
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const { t } = useTranslation();
  dayjs.extend(relativeTime);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5} direction="column">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Stack spacing={0.5} direction="column">
              <Typography variant="caption" color="text.secondary">
                {t('challenges.challengeStarted', { time: dayjs(challenge.finished || undefined).fromNow() })}
              </Typography>
              <Typography variant="h6">{formatResult(challenge, t)}</Typography>
            </Stack>
            <Chip
              label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
              variant="soft"
              color="primary"
              icon={<IconifyIcon icon="mdi:swords" fontSize={18} />}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider flexItem orientation="vertical" />}>
            <ChallengeUserChip player={challenge.playerFirst} highlight={challenge.playerFirst.result > challenge.playerSecond.result} />
            <Box textAlign="center" px={1}>
              <Typography variant="h4" fontWeight={800}>
                {challenge.playerFirst.result} : {challenge.playerSecond.result}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.questionsCount', { count: challenge.questionsCount })}
              </Typography>
            </Box>
            <ChallengeUserChip
              player={challenge.playerSecond}
              align="right"
              highlight={challenge.playerSecond.result > challenge.playerFirst.result}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
