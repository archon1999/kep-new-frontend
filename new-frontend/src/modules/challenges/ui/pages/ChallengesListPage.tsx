import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { authPaths } from 'app/routes/route-config';
import { getResourceById, resources } from 'app/routes/resources';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ChallengeCallCard from '../components/ChallengeCallCard.tsx';
import ChallengeCard from '../components/ChallengeCard.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import {
  useChallengeCalls,
  useChallengesList,
  useChallengesRating,
  useChallengeChapters,
} from '../../application/queries.ts';
import { useAcceptChallengeCall, useCreateChallengeCall } from '../../application/mutations.ts';
import { ChallengeCall } from '../../domain';

const quickStarts = [
  { timeSeconds: 60, questionsCount: 6 },
  { timeSeconds: 50, questionsCount: 5 },
  { timeSeconds: 40, questionsCount: 5 },
  { timeSeconds: 30, questionsCount: 6 },
];

const ChallengesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();

  const { data: calls, mutate: mutateCalls } = useChallengeCalls();
  const { data: challengesPage } = useChallengesList({ page: 1, pageSize: 7 });
  const { data: ratingPreview } = useChallengesRating({ page: 1, pageSize: 5, ordering: '-rating' });
  const { data: chapters } = useChallengeChapters();

  const { trigger: createCall, isMutating: isCreating } = useCreateChallengeCall();
  const { trigger: acceptCall } = useAcceptChallengeCall();

  const [customCall, setCustomCall] = useState({ timeSeconds: 40, questionsCount: 6, chapters: [] as number[] });

  const handleCreate = async (payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }) => {
    if (!currentUser) {
      navigate(authPaths.login);
      return;
    }

    await createCall(payload);
    await mutateCalls();
    enqueueSnackbar(t('challenges.callCreatedToast'), { variant: 'success' });
  };

  const handleQuickStart = async (payload: { timeSeconds: number; questionsCount: number }) => {
    if (!currentUser) {
      navigate(authPaths.login);
      return;
    }

    const existing = (calls ?? []).find(
      (call: ChallengeCall) =>
        call.timeSeconds === payload.timeSeconds && call.questionsCount === payload.questionsCount &&
        call.username !== currentUser?.username,
    );

    if (existing) {
      const result = await acceptCall(existing.id);
      if (result?.challengeId) {
        navigate(getResourceById(resources.Challenge, result.challengeId));
        return;
      }
    }

    await handleCreate(payload);
  };

  const handleAccept = (challengeId?: number) => {
    if (challengeId) navigate(getResourceById(resources.Challenge, challengeId));
    mutateCalls();
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('challenges.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.subtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3} direction="column">
              <Stack spacing={1} direction="column">
                <Typography variant="h6">{t('challenges.quickStartTitle')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.quickStartSubtitle')}
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {quickStarts.map((item) => (
                  <Button
                    key={`${item.timeSeconds}-${item.questionsCount}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleQuickStart(item)}
                  >
                    {t('challenges.quickStartButton', item)}
                  </Button>
                ))}
              </Stack>

              <Divider />

              <Stack spacing={2} direction="column">
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('challenges.customChallenge')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  }}
                >
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {t('challenges.questions')}
                    </Typography>
                    <Slider
                      value={customCall.questionsCount}
                      min={4}
                      max={10}
                      step={1}
                      onChange={(_, value) =>
                        setCustomCall((prev) => ({ ...prev, questionsCount: value as number }))
                      }
                    />
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {t('challenges.timeLimit')}
                    </Typography>
                    <Slider
                      value={customCall.timeSeconds}
                      min={10}
                      max={90}
                      step={10}
                      onChange={(_, value) =>
                        setCustomCall((prev) => ({ ...prev, timeSeconds: value as number }))
                      }
                    />
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {t('challenges.chapters')}
                    </Typography>
                    <Select
                      multiple
                      fullWidth
                      size="small"
                      value={customCall.chapters}
                      onChange={(event) =>
                        setCustomCall((prev) => ({
                          ...prev,
                          chapters: typeof event.target.value === 'string'
                            ? event.target.value.split(',').map(Number)
                            : (event.target.value as number[]),
                        }))
                      }
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {(selected as number[]).map((value) => {
                            const chapter = chapters?.find((item) => item.id === value);
                            return <Chip key={value} size="small" label={chapter?.title ?? value} />;
                          })}
                        </Stack>
                      )}
                    >
                      {(chapters ?? []).map((chapter) => (
                        <MenuItem key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={() => handleCreate(customCall)}
                    disabled={isCreating}
                  >
                    {t('challenges.createCall')}
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2} direction="column">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{t('challenges.waitingRoom')}</Typography>
            <Button variant="text" onClick={() => mutateCalls()}>
              {t('challenges.refresh')}
            </Button>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            {(calls ?? []).map((call) => (
              <Box key={call.id}>
                <ChallengeCallCard
                  challengeCall={call}
                  onAccepted={handleAccept}
                  onRemoved={() => mutateCalls()}
                />
              </Box>
            ))}
            {!calls?.length && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.noCalls')}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Stack>

        <Stack spacing={2} direction="column">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{t('challenges.recent')}</Typography>
            <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
              {t('challenges.viewRating')}
            </Button>
          </Stack>
          <Stack spacing={1.5} direction="column">
            {(challengesPage?.data ?? []).map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
            {!challengesPage?.data?.length && (
              <Typography variant="body2" color="text.secondary">
                {t('challenges.noChallenges')}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5} direction="column">
                <Typography variant="h6">{t('challenges.ratingPreview')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.ratingPreviewSubtitle')}
                </Typography>
              </Stack>
              <Button variant="contained" onClick={() => navigate(resources.ChallengesRating)}>
                {t('challenges.openRating')}
              </Button>
            </Stack>

            <Stack spacing={1.5} direction="column" sx={{ mt: 2 }}>
              {(ratingPreview?.data ?? []).map((row) => (
                <Stack key={row.username} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack spacing={0.25} direction="column">
                    <Typography variant="subtitle2">{row.username}</Typography>
                    <ChallengesRatingChip title={row.rankTitle} size="small" />
                  </Stack>
                  <Typography variant="subtitle2" fontWeight={700}>{row.rating}</Typography>
                </Stack>
              ))}
              {!ratingPreview?.data?.length && (
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.noRating')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ChallengesListPage;
