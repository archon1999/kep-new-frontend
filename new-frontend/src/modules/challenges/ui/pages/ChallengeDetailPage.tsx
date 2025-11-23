import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { resources } from 'app/routes/resources';
import ChallengeQuestionCard, { ChallengeQuestionCardHandle } from '../components/ChallengeQuestionCard.tsx';
import ChallengeResultsCard from '../components/ChallengeResultsCard.tsx';
import ChallengeCountdown from '../components/ChallengeCountdown.tsx';
import { useChallengeDetail } from '../../application/queries.ts';
import { useStartChallenge, useSubmitChallengeAnswer } from '../../application/mutations.ts';
import { ChallengeQuestionTimeType, ChallengeStatus } from '../../domain';
import { responsivePagePaddingSx } from 'shared/lib/styles';

dayjs.extend(relativeTime);

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const arenaId = searchParams.get('arena');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: challenge, isLoading, mutate } = useChallengeDetail(id);
  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();
  const { trigger: submitAnswer, isMutating: submitting } = useSubmitChallengeAnswer();
  useDocumentTitle(
    challenge?.playerFirst?.username && challenge?.playerSecond?.username
      ? 'pageTitles.challenge'
      : undefined,
    challenge
      ? {
          playerFirstUsername: challenge.playerFirst.username,
          playerSecondUsername: challenge.playerSecond.username,
        }
      : undefined,
  );

  const questionCardRef = useRef<ChallengeQuestionCardHandle>(null);
  const timerStartedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const question = useMemo(() => challenge?.nextQuestion?.question, [challenge?.nextQuestion?.question]);

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

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Already || !question) {
      setTimerRunning(false);
      timerStartedRef.current = false;
      return;
    }

    if (challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne) {
      setSecondsLeft(challenge.timeSeconds);
      setTimerRunning(true);
    } else if (!timerStartedRef.current) {
      setSecondsLeft(challenge.timeSeconds);
      setTimerRunning(true);
      timerStartedRef.current = true;
    }
  }, [challenge?.id, challenge?.status, challenge?.nextQuestion?.number, challenge?.questionTimeType, challenge?.timeSeconds, question]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  useEffect(() => {
    if (!timerRunning || secondsLeft > 0) return;
    setTimerRunning(false);
    questionCardRef.current?.submit({
      isFinish: challenge?.questionTimeType === ChallengeQuestionTimeType.TimeToAll,
      force: true,
    });
  }, [timerRunning, secondsLeft, challenge?.questionTimeType]);

  const handleStart = async () => {
    if (!challenge) return;
    await startChallenge(challenge.id);
    await mutate();
  };

  const handleSubmit = async (payload: { answer: unknown; isFinish?: boolean }) => {
    if (!challenge) return;
    const result = await submitAnswer({ challengeId: challenge.id, payload });

    if (result?.success !== undefined) {
      const message = result.success ? t('challenges.answerCorrect') : t('challenges.answerWrong');
      const notify = result.success ? toast.success : toast.error;
      notify(message);
    }

    await mutate();
  };

  const goBack = () => {
    if (arenaId) {
      navigate(resources.ArenaTournament.replace(':id', arenaId));
      return;
    }
    navigate(resources.Challenges);
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
      <Box sx={responsivePagePaddingSx}>
        <Typography variant="body1">{t('challenges.notFound')}</Typography>
      </Box>
    );
  }

  const showQuestion = challenge.status === ChallengeStatus.Already && question;

  return (
    <Box sx={responsivePagePaddingSx}>
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
          <Stack direction="row" spacing={1}>
            <Button variant="text" onClick={goBack}>
              {t('common.back')}
            </Button>
            {challenge.status === ChallengeStatus.NotStarted && (
              <Button variant="contained" onClick={handleStart} disabled={starting}>
                {t('challenges.start')}
              </Button>
            )}
          </Stack>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label={statusLabel} color={challenge.status === ChallengeStatus.Finished ? 'success' : 'primary'} variant="soft" />
              <Stack direction="row" spacing={1}>
                <Chip label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')} variant="outlined" />
                <Chip label={t('challenges.questionsCount', { count: challenge.questionsCount })} variant="outlined" />
                <Chip label={t('challenges.timeLimitShort', { seconds: challenge.timeSeconds })} variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ChallengeResultsCard challenge={challenge} />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            {showQuestion ? (
              <ChallengeQuestionCard
                ref={questionCardRef}
                question={question}
                onSubmit={handleSubmit}
                disabled={submitting}
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
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={2}>
              <ChallengeCountdown
                secondsLeft={secondsLeft}
                totalSeconds={challenge.timeSeconds}
                chapterTitle={question?.chapter?.title}
                chapterIcon={question?.chapter?.icon}
                mode={challenge.questionTimeType}
              />
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1} direction="column">
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('challenges.detailSubtitle', { time: dayjs(challenge.finished || undefined).fromNow() })}
                    </Typography>
                    {challenge.status === ChallengeStatus.Finished && (
                      <Typography variant="body2">{t('challenges.finishedDescription')}</Typography>
                    )}
                    {challenge.status === ChallengeStatus.Already && (
                      <Typography variant="body2" color="text.secondary">
                        {t('challenges.activeQuestion', { number: challenge.nextQuestion?.number })}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ChallengeDetailPage;
