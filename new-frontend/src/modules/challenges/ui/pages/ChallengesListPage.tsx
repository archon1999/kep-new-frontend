import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
import { useArenasList } from 'modules/arena/application/queries.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import {
  useChallengeCalls,
  useChallengeChapters,
  useChallengeUserRating,
  useChallengesList,
  useChallengesRating,
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

  const [page, setPage] = useState(1);
  const pageSize = 7;

  const { data: calls, isLoading: isCallsLoading, mutate: mutateCalls } = useChallengeCalls();
  const { data: challengesPage, isLoading: isChallengesLoading } = useChallengesList({ page, pageSize });
  const { data: ratingPreview } = useChallengesRating({ page: 1, pageSize: 8, ordering: '-rating' });
  const { data: chapters } = useChallengeChapters();
  const { data: userRating } = useChallengeUserRating(currentUser?.username);
  const { data: arenas } = useArenasList({ status: ArenaStatus.Finished, pageSize: 4 });

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
        call.timeSeconds === payload.timeSeconds &&
        call.questionsCount === payload.questionsCount &&
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

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                {currentUser ? (
                  <Stack spacing={1.5} direction="column">
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('challenges.myRating')}
                    </Typography>
                    {userRating ? (
                      <>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h4" fontWeight={800}>
                            {userRating.rating}
                          </Typography>
                          <ChallengesRatingChip title={userRating.rankTitle} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {t('challenges.record', { wins: userRating.wins, draws: userRating.draws, losses: userRating.losses })}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip label={`${t('common.wins', { defaultValue: 'W' })}: ${userRating.wins}`} color="success" variant="soft" />
                          <Chip label={`${t('common.draws', { defaultValue: 'D' })}: ${userRating.draws}`} color="warning" variant="soft" />
                          <Chip label={`${t('common.losses', { defaultValue: 'L' })}: ${userRating.losses}`} color="error" variant="soft" />
                        </Stack>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('challenges.noRating')}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={() => navigate(resources.ChallengesRating)}>
                        {t('challenges.viewRating')}
                      </Button>
                      <Button variant="contained" size="small" onClick={() => navigate(resources.ChallengesUserStatistics)}>
                        {t('challenges.statisticsTitle')}
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">{t('challenges.authRequired')}</Typography>
                    <Button variant="contained" onClick={() => navigate(authPaths.login)}>
                      {t('auth.login')}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
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
                              chapters:
                                typeof event.target.value === 'string'
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
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
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
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {isCallsLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                    ))
                  : (calls ?? []).map((call) => (
                      <Box key={call.id}>
                        <ChallengeCallCard
                          challengeCall={call}
                          onAccepted={handleAccept}
                          onRemoved={() => mutateCalls()}
                        />
                      </Box>
                    ))}
                {!isCallsLoading && !calls?.length && (
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
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2} direction="column">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{t('challenges.ratingPreview')}</Typography>
                <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
                  {t('challenges.openRating')}
                </Button>
              </Stack>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1.5} direction="column">
                    {(ratingPreview?.data ?? []).map((row) => (
                      <Stack
                        key={row.username}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack spacing={0.25} direction="column">
                          <Typography variant="subtitle2">{row.username}</Typography>
                          <ChallengesRatingChip title={row.rankTitle} size="small" />
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {row.rating}
                        </Typography>
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
          </Grid>
        </Grid>

        <Stack spacing={2} direction="column">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{t('challenges.recent')}</Typography>
            <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
              {t('challenges.viewRating')}
            </Button>
          </Stack>
          <Stack spacing={1.5} direction="column">
            {isChallengesLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                ))
              : (challengesPage?.data ?? []).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
            {!isChallengesLoading && !challengesPage?.data?.length && (
              <Typography variant="body2" color="text.secondary">
                {t('challenges.noChallenges')}
              </Typography>
            )}
          </Stack>
          {(challengesPage?.pagesCount ?? 0) > 1 && (
            <Box display="flex" justifyContent="flex-end">
              <Pagination
                color="primary"
                shape="rounded"
                page={page}
                count={challengesPage?.pagesCount ?? 0}
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          )}
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5} direction="column">
                <Typography variant="h6">{t('challenges.arenaWinners')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.arenaWinnersSubtitle')}
                </Typography>
              </Stack>
              <Button variant="contained" onClick={() => navigate(resources.Arena)}>
                {t('challenges.viewArena')}
              </Button>
            </Stack>

            <Stack spacing={1.5} direction="column" sx={{ mt: 2 }}>
              {(arenas?.data ?? []).map((arena) => (
                <Stack key={arena.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{arena.title}</Typography>
                  <Chip
                    label={arena.status === ArenaStatus.Finished ? t('challenges.statusFinished') : ''}
                    variant="outlined"
                  />
                </Stack>
              ))}
              {!arenas?.data?.length && (
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.noArenas')}
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
