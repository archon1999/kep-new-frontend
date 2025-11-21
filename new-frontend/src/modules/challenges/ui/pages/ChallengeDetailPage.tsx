import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import paths from 'app/routes/paths.ts';
import ChallengeUserChip from '../components/ChallengeUserChip.tsx';
import ChallengeQuestionCard from '../components/ChallengeQuestionCard.tsx';
import { useChallengeDetail } from '../../application/queries.ts';
import { useStartChallenge, useSubmitChallengeAnswer } from '../../application/mutations.ts';
import { ChallengeStatus } from '../../domain';

dayjs.extend(relativeTime);

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: challenge, isLoading, mutate } = useChallengeDetail(id);
  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();
  const { trigger: submitAnswer, isMutating: submitting } = useSubmitChallengeAnswer();

  dayjs.extend(relativeTime);

  const statusLabel = useMemo(() => {
    if (!challenge) return '';
    switch (challenge.status) {
      case ChallengeStatus.Finished:
        return t('challenges.statusFinished');
      case ChallengeStatus.NotStarted:
        return t('challenges.statusNotStarted');
      default:
        return t('challenges.statusInProgress');
    }
  }, [challenge, t]);

  const handleStart = async () => {
    if (!challenge) return;
    await startChallenge(challenge.id);
    await mutate();
  };

  const handleSubmit = async (answer: unknown) => {
    if (!challenge) return;
    await submitAnswer({ challengeId: challenge.id, payload: { answer } });
    await mutate();
  };

  const goBackToArena = () => {
    navigate(paths.challenges);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!challenge) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="body1">{t('challenges.notFound')}</Typography>
      </Box>
    );
  }

  const showQuestion = challenge.status !== ChallengeStatus.Finished && challenge.nextQuestion?.question;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3} direction="column">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Stack spacing={0.5} direction="column">
            <Typography variant="h4" fontWeight={800}>
              {t('challenges.detailTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.detailSubtitle', { time: dayjs(challenge.finished || undefined).fromNow() })}
            </Typography>
          </Stack>
          <Button variant="text" onClick={goBackToArena}>
            {t('common.back')}
          </Button>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2} direction="column">
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  {statusLabel}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {challenge.status === ChallengeStatus.NotStarted && (
                    <Button variant="contained" onClick={handleStart} disabled={starting}>
                      {t('challenges.start')}
                    </Button>
                  )}
                  {challenge.status === ChallengeStatus.Finished && (
                    <Button variant="outlined" onClick={goBackToArena}>
                      {t('challenges.backToList')}
                    </Button>
                  )}
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider flexItem orientation="vertical" />}>
                <ChallengeUserChip
                  player={challenge.playerFirst}
                  highlight={challenge.playerFirst.result > challenge.playerSecond.result}
                />
                <Stack spacing={0.5} direction="column" alignItems="center" justifyContent="center" px={2}>
                  <Typography variant="h4" fontWeight={800}>
                    {challenge.playerFirst.result} : {challenge.playerSecond.result}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.questionsCount', { count: challenge.questionsCount })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('challenges.timeLimitShort', { seconds: challenge.timeSeconds })}
                  </Typography>
                </Stack>
                <ChallengeUserChip
                  player={challenge.playerSecond}
                  align="right"
                  highlight={challenge.playerSecond.result > challenge.playerFirst.result}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {showQuestion ? (
          <ChallengeQuestionCard
            question={challenge.nextQuestion?.question}
            onSubmit={handleSubmit}
            disabled={challenge.status !== ChallengeStatus.Already}
            isSubmitting={submitting}
          />
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {challenge.status === ChallengeStatus.Finished
                  ? t('challenges.finishedDescription')
                  : t('challenges.waitingForStart')}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default ChallengeDetailPage;
