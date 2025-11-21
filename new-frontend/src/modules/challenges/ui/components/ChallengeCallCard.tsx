import { useMemo } from 'react';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChallengeCall } from '../../domain';
import { useAcceptChallengeCall, useDeleteChallengeCall } from '../../application/mutations.ts';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';

dayjs.extend(relativeTime);

interface ChallengeCallCardProps {
  challengeCall: ChallengeCall;
  onAccepted?: (challengeId?: number) => void;
  onRemoved?: () => void;
}

const formatDuration = (seconds: number, t: (key: string, options?: any) => string) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes} ${t('common.minutesShort')}${remainingSeconds ? ` ${remainingSeconds}s` : ''}`;
  }
  return `${seconds}s`;
};

const ChallengeCallCard = ({ challengeCall, onAccepted, onRemoved }: ChallengeCallCardProps) => {
  dayjs.extend(relativeTime);
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { trigger: acceptChallenge, isMutating: isAccepting } = useAcceptChallengeCall();
  const { trigger: deleteCall, isMutating: isDeleting } = useDeleteChallengeCall();

  const isOwner = useMemo(() => currentUser?.username === challengeCall.username, [challengeCall.username, currentUser?.username]);

  const handleAccept = async () => {
    const result = await acceptChallenge(challengeCall.id);
    onAccepted?.(result?.challengeId);
  };

  const handleDelete = async () => {
    await deleteCall(challengeCall.id);
    onRemoved?.();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5} direction="column">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5} direction="column">
              <Typography variant="subtitle1" fontWeight={700}>
                {challengeCall.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.callCreated', { time: dayjs(challengeCall.created).fromNow() })}
              </Typography>
            </Stack>
            <ChallengesRatingChip title={challengeCall.rankTitle || t('challenges.rankUnknown')} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} divider={<Divider flexItem orientation="vertical" />}>
            <Stack spacing={0.5} direction="column">
              <Typography variant="overline" color="text.secondary">
                {t('challenges.questions')}
              </Typography>
              <Typography variant="subtitle2">{challengeCall.questionsCount}</Typography>
            </Stack>
            <Stack spacing={0.5} direction="column">
              <Typography variant="overline" color="text.secondary">
                {t('challenges.timeLimit')}
              </Typography>
              <Typography variant="subtitle2">{formatDuration(challengeCall.timeSeconds, t)}</Typography>
            </Stack>
            {challengeCall.chapters?.length ? (
              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.chapters')}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {challengeCall.chapters.map((chapter) => (
                    <Chip key={chapter.id} size="small" label={chapter.title} variant="soft" />
                  ))}
                </Stack>
              </Stack>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {isOwner ? (
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {t('challenges.deleteCall')}
              </Button>
            ) : null}
            <Button
              variant="contained"
              size="small"
              onClick={handleAccept}
              disabled={isAccepting}
            >
              {t('challenges.acceptCall')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeCallCard;
