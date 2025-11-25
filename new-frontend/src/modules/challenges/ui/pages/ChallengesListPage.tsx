import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Avatar,
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
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { authPaths } from 'app/routes/route-config';
import { useArenasList } from 'modules/arena/application/queries.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import { useAcceptChallengeCall, useCreateChallengeCall } from '../../application/mutations.ts';
import {
  useChallengeCalls,
  useChallengeChapters,
  useChallengeUserRating,
  useChallengesList,
  useChallengesRating,
} from '../../application/queries.ts';
import { ChallengeCall } from '../../domain';
import ChallengeCallCard from '../components/ChallengeCallCard.tsx';
import ChallengeCard from '../components/ChallengeCard.tsx';

type ChallengesTab = 'quickstart' | 'queue' | 'history';

const quickStarts = [
  { timeSeconds: 60, questionsCount: 6 },
  { timeSeconds: 50, questionsCount: 5 },
  { timeSeconds: 40, questionsCount: 5 },
  { timeSeconds: 30, questionsCount: 6 },
];

const ChallengesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useDocumentTitle('pageTitles.challenges');

  const [page, setPage] = useState(1);
  const pageSize = 7;
  const [activeTab, setActiveTab] = useState<ChallengesTab>('queue');

  const { data: calls, isLoading: isCallsLoading, mutate: mutateCalls } = useChallengeCalls();
  const { data: challengesPage, isLoading: isChallengesLoading } = useChallengesList({
    page,
    pageSize,
  });
  const { data: ratingPreview, isLoading: isRatingLoading } = useChallengesRating({
    page: 1,
    pageSize: 10,
    ordering: '-rating',
  });
  const { data: chapters } = useChallengeChapters();
  const { data: userRating } = useChallengeUserRating(currentUser?.username);
  const { data: arenas, isLoading: isArenasLoading } = useArenasList({
    status: ArenaStatus.Finished,
    pageSize: 8,
  });

  const { trigger: createCall, isMutating: isCreating } = useCreateChallengeCall();
  const { trigger: acceptCall, isMutating: isAccepting } = useAcceptChallengeCall();

  const [customCall, setCustomCall] = useState({
    timeSeconds: 40,
    questionsCount: 6,
    chapters: [] as number[],
  });

  const handleCreate = async (payload: {
    timeSeconds: number;
    questionsCount: number;
    chapters?: number[];
  }) => {
    if (!currentUser) {
      navigate(authPaths.login);
      return;
    }

    await createCall(payload);
    await mutateCalls();
    setActiveTab('queue');
    toast.success(t('challenges.callCreatedToast'));
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

  const renderQuickStart = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(25,118,210,0.08), rgba(0,171,85,0.1))',
            borderColor: 'primary.lighter',
          }}
        >
          <CardContent sx={{ height: '100%' }}>
            <Stack spacing={3} direction="column" height="100%">
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="challenge" fontSize={26} color="primary.main" />
                <Typography variant="h6">{t('challenges.quickStartTitle')}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.quickStartSubtitle')}
              </Typography>

              <Grid container spacing={1.5}>
                {quickStarts.map((item) => (
                  <Grid
                    key={`${item.timeSeconds}-${item.questionsCount}`}
                    size={{ xs: 12, sm: 6, md: 3 }}
                  >
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      onClick={() => handleQuickStart(item)}
                      disabled={isCreating || isAccepting}
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: 2,
                        minHeight: 72,
                        backgroundColor: 'primary.main',
                      }}
                    >
                      <Stack direction="column" spacing={0.25} alignItems="flex-start">
                        <Typography variant="subtitle2" fontWeight={800}>
                          {t('challenges.quickStartButton', item)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary.contrastText"
                          sx={{ opacity: 0.8 }}
                        >
                          {t('challenges.timeLimitShort', { seconds: item.timeSeconds })}
                        </Typography>
                      </Stack>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack spacing={0.5} direction="column">
              <Typography variant="subtitle1" fontWeight={700}>
                {t('challenges.customChallenge')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.quickStartSubtitle')}
              </Typography>
            </Stack>

            <Stack spacing={1.5} direction="column">
              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.questions')}
                </Typography>
                <Slider
                  value={customCall.questionsCount}
                  min={4}
                  max={10}
                  step={1}
                  valueLabelDisplay="on"
                  onChange={(_, value) =>
                    setCustomCall((prev) => ({ ...prev, questionsCount: value as number }))
                  }
                />
              </Stack>

              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('challenges.timeLimit')}
                </Typography>
                <Slider
                  value={customCall.timeSeconds}
                  min={10}
                  max={90}
                  step={10}
                  valueLabelDisplay="on"
                  onChange={(_, value) =>
                    setCustomCall((prev) => ({ ...prev, timeSeconds: value as number }))
                  }
                />
              </Stack>

              <Stack spacing={0.5} direction="column">
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
                        return (
                          <Chip
                            key={value}
                            size="small"
                            label={chapter?.title ?? value}
                            variant="soft"
                          />
                        );
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
              </Stack>
            </Stack>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => handleCreate(customCall)}
                disabled={isCreating}
              >
                {t('challenges.createCall')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderQueue = () => (
    <Stack spacing={2} direction="column">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="h6">{t('challenges.waitingRoom')}</Typography>
        <Button variant="outlined" size="small" onClick={() => mutateCalls()}>
          {t('challenges.refresh')}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isCallsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : (calls ?? []).map((call) => (
              <Grid key={call.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <ChallengeCallCard
                  challengeCall={call}
                  onAccepted={handleAccept}
                  onRemoved={() => mutateCalls()}
                />
              </Grid>
            ))}
        {!isCallsLoading && !calls?.length && (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.noCalls')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Stack>
  );

  const renderHistory = () => {
    const challenges = challengesPage?.data ?? [];
    const showSkeleton = isChallengesLoading && !challenges.length;

    return (
      <Stack spacing={2} direction="column">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="h6">{t('challenges.recent')}</Typography>
          <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
            {t('challenges.viewRating')}
          </Button>
        </Stack>

        <Stack spacing={1.5} direction="column">
          {showSkeleton
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
              ))
            : challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}

          {!isChallengesLoading && !challenges.length && (
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
    );
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, md: 3 },
            background: 'linear-gradient(120deg, rgba(25,118,210,0.08), rgba(0,171,85,0.12))',
            border: '1px solid',
            borderColor: 'primary.lighter',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} direction="column">
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="challenges" fontSize={30} color="primary.main" />
                <Typography variant="h4" fontWeight={800}>
                  {t('challenges.title')}
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {t('challenges.subtitle')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="challenge-time" fontSize={18} />}
                  onClick={() => setActiveTab('quickstart')}
                >
                  {t('challenges.quickStartTitle')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="ranking" fontSize={18} />}
                  onClick={() => navigate(resources.ChallengesRating)}
                >
                  {t('challenges.viewRating')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="statistics" fontSize={18} />}
                  onClick={() => navigate(resources.ChallengesUserStatistics)}
                >
                  {t('challenges.statisticsTitle')}
                </Button>
              </Stack>
            </Stack>

            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                minWidth: { xs: '100%', sm: 300 },
                maxWidth: 360,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Stack spacing={1.25} direction="column">
                  <Typography variant="overline" color="text.secondary">
                    {t('challenges.myRating')}
                  </Typography>
                  {userRating ? (
                    <>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h3" fontWeight={800}>
                          {userRating.rating}
                        </Typography>
                        <ChallengesRatingChip title={userRating.rankTitle} />
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                          label={`${t('common.wins')}: ${userRating.wins}`}
                          color="success"
                          variant="soft"
                          size="small"
                        />
                        <Chip
                          label={`${t('common.draws')}: ${userRating.draws}`}
                          color="warning"
                          variant="soft"
                          size="small"
                        />
                        <Chip
                          label={`${t('common.losses')}: ${userRating.losses}`}
                          color="error"
                          variant="soft"
                          size="small"
                        />
                      </Stack>
                    </>
                  ) : (
                    <Stack spacing={1} direction="column">
                      <Typography variant="body2" color="text.secondary">
                        {currentUser ? t('challenges.noRating') : t('challenges.authRequired')}
                      </Typography>
                      {!currentUser && (
                        <Button variant="contained" onClick={() => navigate(authPaths.login)}>
                          {t('auth.login')}
                        </Button>
                      )}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ pb: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="quickstart" label={t('challenges.quickStartTitle')} />
              <Tab value="queue" label={t('challenges.waitingRoom')} />
              <Tab value="history" label={t('challenges.recent')} />
            </Tabs>
          </CardContent>
          <Divider />
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {activeTab === 'quickstart' && renderQuickStart()}
            {activeTab === 'queue' && renderQueue()}
            {activeTab === 'history' && renderHistory()}
          </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ height: '100%' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Stack spacing={0.25}>
                    <Typography variant="h6">{t('challenges.ratingPreview')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.ratingPreviewSubtitle')}
                    </Typography>
                  </Stack>
                  <Button variant="text" onClick={() => navigate(resources.ChallengesRating)}>
                    {t('challenges.openRating')}
                  </Button>
                </Stack>

                <Stack spacing={1.25} direction="column">
                  {isRatingLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          variant="rectangular"
                          height={52}
                          sx={{ borderRadius: 2 }}
                        />
                      ))
                    : (ratingPreview?.data ?? []).map((row, index) => (
                        <Stack
                          key={row.username}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 1.25,
                          }}
                        >
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Chip
                              label={row.rowIndex || index + 1}
                              size="small"
                              color="primary"
                              variant="soft"
                            />
                            <Stack spacing={0.25} direction="column">
                              <Typography variant="subtitle2">{row.username}</Typography>
                              <ChallengesRatingChip title={row.rankTitle} size="small" />
                            </Stack>
                          </Stack>
                          <Typography variant="subtitle2" fontWeight={800}>
                            {row.rating}
                          </Typography>
                        </Stack>
                      ))}
                  {!isRatingLoading && !ratingPreview?.data?.length && (
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.noRating')}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack spacing={0.5} direction="column">
                  <Typography variant="h6">{t('challenges.arenaWinners')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.arenaWinnersSubtitle')}
                  </Typography>
                </Stack>

                <Stack spacing={1.25} direction="column" sx={{ mt: 2 }}>
                  {isArenasLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          variant="rectangular"
                          height={64}
                          sx={{ borderRadius: 2 }}
                        />
                      ))
                    : (arenas?.data ?? []).map((arena) => {
                        const winner: any = arena.winner ?? {};
                        return (
                          <Stack
                            key={arena.id}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              p: 1.25,
                            }}
                          >
                            <Stack spacing={0.25} direction="column">
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <KepIcon name="arena" fontSize={20} color="primary.main" />
                                <Typography variant="subtitle2">{arena.title}</Typography>
                              </Stack>
                              {winner?.username ? (
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                  <Avatar
                                    sx={{ width: 28, height: 28, bgcolor: 'background.neutral' }}
                                  >
                                    {winner.username?.charAt(0)?.toUpperCase()}
                                  </Avatar>
                                  <Stack spacing={0.15} direction="column">
                                    <Typography variant="body2">{winner.username}</Typography>
                                    <ChallengesRatingChip
                                      title={winner.rankTitle ?? winner.rank_title}
                                      size="small"
                                    />
                                  </Stack>
                                </Stack>
                              ) : null}
                            </Stack>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                navigate(getResourceById(resources.ArenaTournament, arena.id))
                              }
                            >
                              {t('challenges.viewArena')}
                            </Button>
                          </Stack>
                        );
                      })}
                  {!isArenasLoading && !arenas?.data?.length && (
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.noArenas')}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ChallengesListPage;
