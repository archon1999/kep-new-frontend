import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GridPaginationModel } from '@mui/x-data-grid';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { useAuth } from 'app/providers/AuthProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import Logo from 'shared/components/common/Logo';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { getItemFromStore, setItemToStore } from 'shared/lib/utils';
import { wsService } from 'shared/services/websocket';
import useSWR from 'swr';
import {
  problemsQueries,
  useAttemptsList,
  useHackAttempts,
  useProblemDetail,
} from '../../application/queries';
import { ProblemSampleTest } from '../../domain/entities/problem.entity';
import { AttemptsListParams, HackAttemptsListParams } from '../../domain/ports/problems.repository';
import ProblemsAttemptsTable from '../components/ProblemsAttemptsTable';
import { HackAttemptsCard } from '../components/problem-detail/HackAttemptsCard';
import { PanelHandle } from '../components/problem-detail/PanelHandles';
import { ProblemDescription } from '../components/problem-detail/ProblemDescription';
import { ProblemEditorPanel } from '../components/problem-detail/ProblemEditorPanel';
import { ProblemFooter } from '../components/problem-detail/ProblemFooter';
import { ProblemStatisticsTab } from '../components/problem-detail/ProblemStatisticsTab';

const STORAGE_LANG_KEY = 'problem-submit-lang';

const difficultyColorMap: Record<
  number,
  'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary'
> = {
  1: 'success',
  2: 'info',
  3: 'primary',
  4: 'primary',
  5: 'warning',
  6: 'error',
  7: 'secondary',
};

const useProblemPermissions = (permissionsRaw: any) => {
  return useMemo(() => {
    if (!permissionsRaw)
      return { canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false };
    if (typeof permissionsRaw === 'string') {
      try {
        permissionsRaw = JSON.parse(permissionsRaw);
      } catch {
        return { canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false };
      }
    }

    return {
      canCreateProblems: Boolean(
        permissionsRaw.canCreateProblems ?? permissionsRaw.can_create_problems,
      ),
      canChangeProblemTags: Boolean(
        permissionsRaw.canChangeProblemTags ?? permissionsRaw.can_change_problem_tags,
      ),
      canUseCheckSamples: Boolean(
        permissionsRaw.canUseCheckSamples ?? permissionsRaw.can_use_check_samples,
      ),
    };
  }, [permissionsRaw]);
};

const ProblemDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const { navColor } = useSettingsContext();
  const permissions = useProblemPermissions(currentUser?.permissions);
  const editorTheme = theme.palette.mode === 'dark' ? 'vs-dark' : 'vs';

  const params = useParams<{ id: string }>();
  const problemId = Number(params.id);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'description' | 'attempts' | 'hacks' | 'stats'>(
    (searchParams.get('tab') as 'attempts' | 'hacks' | 'stats') || 'description',
  );
  const [selectedLang, setSelectedLang] = useState('');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSamples, setIsCheckingSamples] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [checkSamplesResult, setCheckSamplesResult] = useState<
    Array<{ verdict: number; input?: string; output?: string; answer?: string }>
  >([]);
  const [editorTab, setEditorTab] = useState<'console' | 'samples'>('console');
  const [myAttemptsOnly, setMyAttemptsOnly] = useState(true);
  const [hackPagination, setHackPagination] = useState({ page: 0, pageSize: 10 });
  const [attemptsPagination, setAttemptsPagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [problemSearch, setProblemSearch] = useState('');
  const debouncedProblemSearch = useDebouncedValue(problemSearch, 300);

  const {
    data: problem,
    isLoading: isProblemLoading,
    mutate: mutateProblem,
  } = useProblemDetail(Number.isNaN(problemId) ? undefined : problemId);

  const { data: hackAttemptsPage, mutate: mutateHackAttempts } = useHackAttempts(
    useMemo<HackAttemptsListParams>(
      () => ({
        problemId: problemId || undefined,
        page: hackPagination.page + 1,
        pageSize: hackPagination.pageSize,
      }),
      [problemId, hackPagination.page, hackPagination.pageSize],
    ),
  );

  const attemptsParams = useMemo<AttemptsListParams>(
    () => ({
      problemId: problemId || undefined,
      username: myAttemptsOnly ? currentUser?.username : undefined,
      page: attemptsPagination.page + 1,
      pageSize: attemptsPagination.pageSize,
      ordering: '-id',
    }),
    [
      problemId,
      myAttemptsOnly,
      currentUser?.username,
      attemptsPagination.page,
      attemptsPagination.pageSize,
    ],
  );

  const {
    data: attemptsPage,
    mutate: mutateAttempts,
    isLoading: isAttemptsLoading,
  } = useAttemptsList(attemptsParams);

  const selectedLanguage = useMemo(
    () => problem?.availableLanguages?.find((lang) => lang.lang === selectedLang) ?? null,
    [problem?.availableLanguages, selectedLang],
  );

  const sampleTests: ProblemSampleTest[] = problem?.sampleTests ?? [];

  useEffect(() => {
    if (problem?.id) {
      const storedLang =
        (getItemFromStore(STORAGE_LANG_KEY, problem.availableLanguages?.[0]?.lang) as string) || '';
      const available = problem.availableLanguages?.find((lang) => lang.lang === storedLang);
      const fallback = problem.availableLanguages?.[0];
      const langToUse = available?.lang ?? fallback?.lang ?? '';
      setSelectedLang(langToUse);
    }
  }, [problem?.id, problem?.availableLanguages]);

  useEffect(() => {
    if (!problem?.id || !selectedLang) return;

    const codeKey = `problem-${problem.id}-code-${selectedLang}`;
    const storedCode = (getItemFromStore(codeKey, '') as string) || '';
    const template = selectedLanguage?.codeTemplate || '';
    setCode(storedCode || template);
    setItemToStore(STORAGE_LANG_KEY, JSON.stringify(selectedLang));
  }, [problem?.id, selectedLang, selectedLanguage?.codeTemplate]);

  useEffect(() => {
    if (!problem) return;
    const test = sampleTests[selectedSampleIndex];
    if (test) {
      setInput(test.input ?? '');
      setAnswer(test.output ?? '');
    }
  }, [problem?.id, sampleTests, selectedSampleIndex]);

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    unsubscribers.push(
      wsService.on('custom-test-result', (result: any) => {
        const text = `${result.output ?? ''}${result.error ?? ''}`;
        const meta = [
          result.time ? `Time: ${result.time}ms` : null,
          result.memory ? `Memory: ${result.memory}KB` : null,
        ]
          .filter(Boolean)
          .join(' | ');
        setOutput([text.trim(), meta].filter(Boolean).join('\n'));
        setIsRunning(false);
      }),
    );

    unsubscribers.push(
      wsService.on('answer-for-input-result', (result: any) => {
        setAnswer(result?.answer ? `${t('problems.detail.answer')}: ${result.answer}` : '');
        setIsAnswering(false);
      }),
    );

    unsubscribers.push(
      wsService.on('check-sample-tests-result', (result: any[]) => {
        setCheckSamplesResult(result || []);
        setIsCheckingSamples(false);
        setEditorTab('samples');
      }),
    );

    // wsService.send('lang-change', i18n.language);

    return () => unsubscribers.forEach((off) => off());
  }, [i18n.language, t]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'attempts' || tab === 'hacks' || tab === 'stats') {
      setActiveTab(tab);
    } else {
      setActiveTab('description');
    }
  }, [searchParams]);

  const handleTabChange = (_: unknown, value: 'description' | 'attempts' | 'hacks' | 'stats') => {
    setActiveTab(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'description') {
      next.delete('tab');
    } else {
      next.set('tab', value);
    }
    setSearchParams(next, { replace: true });
  };

  const handlePrev = async () => {
    if (!problem?.id) return;
    const prevId = await problemsQueries.problemsRepository.getProblemPrev(problem.id);
    if (prevId) {
      navigate(getResourceById(resources.Problem, prevId));
    }
  };

  const handleNext = async () => {
    if (!problem?.id) return;
    const nextId = await problemsQueries.problemsRepository.getProblemNext(problem.id);
    if (nextId) {
      navigate(getResourceById(resources.Problem, nextId));
    }
  };

  const problemOptionsFetcher = async ([, search]: [string, string]) => {
    const page = await problemsQueries.problemsRepository.list({
      search: search || undefined,
      page: 1,
      pageSize: 8,
      ordering: 'id',
    });
    return page.data.map((item) => ({ id: item.id, title: item.title }));
  };

  const { data: problemOptions = [] } = useSWR(
    ['problem-switcher', debouncedProblemSearch],
    problemOptionsFetcher,
  );

  useEffect(() => {
    if (problem?.id && problemOptions.length) {
      const exists = problemOptions.some((opt) => opt.id === problem.id);
      if (!exists) {
        setProblemSearch(`${problem.id}`);
      }
    }
  }, [problem?.id, problemOptions]);

  const selectedProblemOption = useMemo(() => {
    if (!problem?.id) return null;
    return { id: problem.id, title: problem.title };
  }, [problem?.id, problem?.title]);

  const combinedProblemOptions = useMemo(() => {
    if (!selectedProblemOption) return problemOptions;
    const hasCurrent = problemOptions.some((opt) => opt.id === selectedProblemOption.id);
    return hasCurrent ? problemOptions : [selectedProblemOption, ...problemOptions];
  }, [problemOptions, selectedProblemOption]);

  const handleProblemSelect = (_: unknown, option: { id: number; title: string } | null) => {
    if (option?.id) {
      navigate(getResourceById(resources.Problem, option.id));
    }
  };

  const handleSubmit = async () => {
    if (!problem?.id || !selectedLang || !code || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await problemsQueries.problemsRepository.submitSolution(problem.id, {
        sourceCode: code,
        lang: selectedLang,
      });
      enqueueSnackbar(t('problems.detail.submitSuccess'), { variant: 'success' });
      setActiveTab('attempts');
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', 'attempts');
        return next;
      });
      mutateAttempts();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    if (!problem?.id || !selectedLang || !code || isRunning) return;
    setIsRunning(true);
    setOutput('');
    const response = await problemsQueries.problemsRepository.runCustomTest({
      sourceCode: code,
      lang: selectedLang,
      inputData: input,
    });
    if (response?.id) {
      wsService.send('custom-test-add', response.id);
    }
    setTimeout(() => setIsRunning(false), 8000);
  };

  const handleCheckSamples = async () => {
    if (!problem?.id || !selectedLang || !code || isCheckingSamples) return;
    setIsCheckingSamples(true);
    setCheckSamplesResult([]);
    const response = await problemsQueries.problemsRepository.checkSampleTests(problem.id, {
      sourceCode: code,
      lang: selectedLang,
    });
    if (response?.id) {
      wsService.send('check-sample-tests-add', response.id);
    }
    setTimeout(() => setIsCheckingSamples(false), 15000);
  };

  const handleAnswerForInput = async (payload?: any) => {
    if (!problem?.id || isAnswering) return;
    setIsAnswering(true);
    const id = payload?.id;
    if (id) {
      wsService.send('answer-for-input-add', id);
      setTimeout(() => setIsAnswering(false), 12000);
      return;
    }
    const response = await problemsQueries.problemsRepository.answerForInput(problem.id, {
      input_data: input,
      lang: selectedLang,
      sourceCode: code,
    });
    if (response?.id) {
      wsService.send('answer-for-input-add', response.id);
    }
    setTimeout(() => setIsAnswering(false), 12000);
  };

  const handleFavoriteToggle = async () => {
    if (!problem?.id) return;
    if (problem.userInfo?.isFavorite) {
      await problemsQueries.problemsRepository.removeFavorite(problem.id);
    } else {
      await problemsQueries.problemsRepository.addFavorite(problem.id);
    }
    mutateProblem();
  };

  const handleLikeDislike = async (type: 'like' | 'dislike') => {
    if (!problem?.id) return;
    if (type === 'like') {
      await problemsQueries.problemsRepository.likeProblem(problem.id);
    } else {
      await problemsQueries.problemsRepository.dislikeProblem(problem.id);
    }
    mutateProblem();
  };

  const selectedDifficultyColor = difficultyColorMap[problem?.difficulty ?? 0] || 'primary';

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        minWidth: 1000,
        flexDirection: 'column',
        bgcolor: 'background.elevation1',
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          px: { xs: 2, md: 3 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundImage:
            navColor === 'vibrant'
              ? 'linear-gradient(90deg, rgba(124,77,255,0.85), rgba(3,169,244,0.85))'
              : undefined,
          color: navColor === 'vibrant' ? 'common.white' : undefined,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <Logo showName={false} />
          <Autocomplete
            size="small"
            sx={{ minWidth: 240 }}
            options={combinedProblemOptions}
            getOptionLabel={(option) => `${option.id}. ${option.title}`}
            onChange={handleProblemSelect}
            onInputChange={(_, value) => setProblemSearch(value)}
            filterOptions={(opts) => opts}
            value={selectedProblemOption}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label={t('problems.detail.selectProblem')}
                placeholder="1234"
              />
            )}
          />
          <Tooltip title={t('problems.detail.previousProblem')}>
            <span>
              <IconButton onClick={handlePrev} color="primary" disabled={!problem?.id}>
                <IconifyIcon icon="mdi:chevron-left" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.nextProblem')}>
            <span>
              <IconButton onClick={handleNext} color="primary" disabled={!problem?.id}>
                <IconifyIcon icon="mdi:chevron-right" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.run')}>
            <span>
              <IconButton
                color="primary"
                onClick={handleRun}
                disabled={!currentUser || isRunning || !code}
                size="large"
              >
                <IconifyIcon icon="mdi:play-circle-outline" width={22} height={22} />
              </IconButton>
            </span>
          </Tooltip>

          {permissions.canUseCheckSamples || currentUser?.isSuperuser ? (
            <Tooltip title={t('problems.detail.checkSamples')}>
              <span>
                <IconButton
                  color="secondary"
                  onClick={handleCheckSamples}
                  disabled={!currentUser || isCheckingSamples || !code}
                  size="large"
                >
                  <IconifyIcon icon="mdi:check-all" width={22} height={22} />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title={t('problems.detail.checkSamples')}>
              <span>
                <KepcoinSpendConfirm
                  value={100}
                  purchaseUrl={`/api/problems/${problemId}/purchase-check-samples/`}
                  disabled={!currentUser}
                  onSuccess={() => mutateProblem()}
                >
                  <IconButton color="secondary" disabled={!currentUser} size="large">
                    <IconifyIcon icon="mdi:check-all" width={22} height={22} />
                  </IconButton>
                </KepcoinSpendConfirm>
              </span>
            </Tooltip>
          )}

          {problem?.hasSolution && problem?.hasCheckInput ? (
            <Tooltip
              title={
                isAnswering ? t('problems.detail.waiting') : t('problems.detail.answerForInput')
              }
            >
              <span>
                <KepcoinSpendConfirm
                  value={1}
                  purchaseUrl={`/api/problems/${problem?.id}/answer-for-input/`}
                  requestBody={{ input_data: input }}
                  onSuccess={handleAnswerForInput}
                  disabled={!currentUser}
                >
                  <IconButton color="info" disabled={!currentUser || isAnswering} size="large">
                    <IconifyIcon icon="mdi:chat-question-outline" width={22} height={22} />
                  </IconButton>
                </KepcoinSpendConfirm>
              </span>
            </Tooltip>
          ) : null}

          <Tooltip title={t('problems.detail.submit')}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!currentUser || isSubmitting || !code}
                sx={{ minWidth: 44, px: 1 }}
              >
                <IconifyIcon icon="mdi:send-outline" width={18} height={18} />
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <AppbarActionItems type="slim" />
        </Box>
      </Box>

      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        {isProblemLoading && <LinearProgress />}

        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={50} minSize={35}>
              <Card background={0} sx={{ height: '100%', overflow: 'auto' }}>
                {problem ? (
                  <>
                    <CardHeader
                      title={
                        <Tabs
                          value={activeTab}
                          onChange={handleTabChange}
                          variant="scrollable"
                          scrollButtons="auto"
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab
                            value="description"
                            label={t('problems.detail.problemTab')}
                            icon={<IconifyIcon icon="mdi:book-open-page-variant" />}
                            iconPosition="start"
                          />
                          <Tab
                            value="attempts"
                            label={t('problems.detail.attemptsTab')}
                            icon={<IconifyIcon icon="mdi:history" />}
                            iconPosition="start"
                          />
                          <Tab
                            value="stats"
                            label={t('problems.detail.stats')}
                            icon={<IconifyIcon icon="mdi:chart-bar" />}
                            iconPosition="start"
                          />
                          <Tab
                            value="hacks"
                            label={t('problems.detail.hacksTab')}
                            icon={<IconifyIcon icon="mdi:sword-cross" />}
                            iconPosition="start"
                            disabled={!problem?.hasCheckInput}
                          />
                        </Tabs>
                      }
                    ></CardHeader>

                    {activeTab === 'description' && (
                      <>
                        <CardContent>
                          <ProblemDescription
                            problem={problem}
                            selectedDifficultyColor={selectedDifficultyColor}
                          />
                        </CardContent>

                        <ProblemFooter
                          problem={problem}
                          onFavoriteToggle={handleFavoriteToggle}
                          onLike={() => handleLikeDislike('like')}
                          onDislike={() => handleLikeDislike('dislike')}
                        />
                      </>
                    )}

                    {activeTab === 'attempts' && (
                      <Card variant="outlined" sx={{ mt: 2 }}>
                        <CardContent>
                          {currentUser ? (
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                              <Chip
                                label={t('problems.detail.myAttempts')}
                                color={myAttemptsOnly ? 'primary' : 'default'}
                                onClick={() => setMyAttemptsOnly((prev) => !prev)}
                              />
                            </Stack>
                          ) : null}
                          <ProblemsAttemptsTable
                            attempts={attemptsPage?.data ?? []}
                            total={attemptsPage?.total ?? 0}
                            paginationModel={attemptsPagination}
                            onPaginationChange={setAttemptsPagination}
                            isLoading={isAttemptsLoading}
                            onRerun={() => mutateAttempts()}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {activeTab === 'stats' && <ProblemStatisticsTab problemId={problem.id} />}

                    {activeTab === 'hacks' && (
                      <HackAttemptsCard
                        attempts={hackAttemptsPage?.data ?? []}
                        total={hackAttemptsPage?.total ?? 0}
                        pagination={hackPagination}
                        onPaginationChange={setHackPagination}
                        onRefresh={() => mutateHackAttempts()}
                      />
                    )}
                  </>
                ) : (
                  <Typography color="text.secondary">{t('problems.detail.noProblem')}</Typography>
                )}
              </Card>
            </Panel>

            <PanelHandle />

            <Panel defaultSize={50} minSize={35}>
              <ProblemEditorPanel
                problem={problem}
                code={code}
                onCodeChange={(value) => {
                  if (!problem?.id || !selectedLang) return;
                  setCode(value);
                  const codeKey = `problem-${problem.id}-code-${selectedLang}`;
                  setItemToStore(codeKey, JSON.stringify(value ?? ''));
                }}
                selectedLang={selectedLang}
                onLangChange={setSelectedLang}
                sampleTests={sampleTests}
                selectedSampleIndex={selectedSampleIndex}
                onSampleChange={setSelectedSampleIndex}
                input={input}
                onInputChange={setInput}
                output={output}
                answer={answer}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onCheckSamples={handleCheckSamples}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                isCheckingSamples={isCheckingSamples}
                checkSamplesResult={checkSamplesResult}
                editorTab={editorTab}
                onEditorTabChange={setEditorTab}
                currentUser={currentUser}
                canUseCheckSamples={permissions.canUseCheckSamples || currentUser?.isSuperuser}
                editorTheme={editorTheme}
              />
            </Panel>
          </PanelGroup>
        </Box>
      </Card>
    </Box>
  );
};

export default ProblemDetailPage;
