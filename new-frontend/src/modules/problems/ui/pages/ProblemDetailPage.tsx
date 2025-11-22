import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  MenuItem,
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
import { problemsQueries, useAttemptsList, useHackAttempts, useProblemDetail, useProblemSolution, useProblemStatistics } from '../../application/queries';
import { AttemptLangs, HackAttempt, ProblemDetail, ProblemSampleTest, Verdicts } from '../../domain/entities/problem.entity';
import { AttemptsListParams, HackAttemptsListParams } from '../../domain/ports/problems.repository';
import ProblemsAttemptsTable from '../components/ProblemsAttemptsTable';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import Editor, { useMonaco } from '@monaco-editor/react';
import UserPopover from 'modules/users/ui/components/UserPopover';


const STORAGE_LANG_KEY = 'problem-submit-lang';

const difficultyColorMap: Record<number, 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary'> = {
  1: 'success',
  2: 'info',
  3: 'primary',
  4: 'primary',
  5: 'warning',
  6: 'error',
  7: 'secondary',
};

const getEditorLanguage = (lang: string) =>
  ({
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
    [AttemptLangs.TS]: 'typescript',
    [AttemptLangs.RUST]: 'rust',
  }[lang] || lang || 'javascript');

const PanelHandle = () => (
  <PanelResizeHandle
    style={{
      width: 10,
      cursor: 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        height: 48,
        width: 2,
        borderRadius: 1,
        bgcolor: 'divider',
      }}
    />
  </PanelResizeHandle>
);

const VerticalHandle = () => (
  <PanelResizeHandle
    style={{
      height: 10,
      cursor: 'row-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 2,
        borderRadius: 1,
        bgcolor: 'divider',
      }}
    />
  </PanelResizeHandle>
);

const useProblemPermissions = (permissionsRaw: any) => {
  return useMemo(() => {
    if (!permissionsRaw) return {canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false};
    if (typeof permissionsRaw === 'string') {
      try {
        permissionsRaw = JSON.parse(permissionsRaw);
      } catch {
        return {canCreateProblems: false, canChangeProblemTags: false, canUseCheckSamples: false};
      }
    }

    return {
      canCreateProblems: Boolean(permissionsRaw.canCreateProblems ?? permissionsRaw.can_create_problems),
      canChangeProblemTags: Boolean(permissionsRaw.canChangeProblemTags ?? permissionsRaw.can_change_problem_tags),
      canUseCheckSamples: Boolean(permissionsRaw.canUseCheckSamples ?? permissionsRaw.can_use_check_samples),
    };
  }, [permissionsRaw]);
};

const ProblemDetailPage = () => {
  const {t, i18n} = useTranslation();
  const {enqueueSnackbar} = useSnackbar();
  const {currentUser} = useAuth();
  const theme = useTheme();
  const {navColor} = useSettingsContext();
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
  const [hackPagination, setHackPagination] = useState({page: 0, pageSize: 10});
  const [attemptsPagination, setAttemptsPagination] = useState<GridPaginationModel>({page: 0, pageSize: 10});
  const [problemSearch, setProblemSearch] = useState('');
  const debouncedProblemSearch = useDebouncedValue(problemSearch, 300);

  const {data: problem, isLoading: isProblemLoading, mutate: mutateProblem} = useProblemDetail(
    Number.isNaN(problemId) ? undefined : problemId,
  );

  const {data: hackAttemptsPage, mutate: mutateHackAttempts} = useHackAttempts(
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
    [problemId, myAttemptsOnly, currentUser?.username, attemptsPagination.page, attemptsPagination.pageSize],
  );

  const {data: attemptsPage, mutate: mutateAttempts, isLoading: isAttemptsLoading} = useAttemptsList(attemptsParams);

  const selectedLanguage = useMemo(
    () => problem?.availableLanguages?.find((lang) => lang.lang === selectedLang) ?? null,
    [problem?.availableLanguages, selectedLang],
  );

  const sampleTests: ProblemSampleTest[] = problem?.sampleTests ?? [];

  useEffect(() => {
    if (problem?.id) {
      const storedLang = (getItemFromStore(STORAGE_LANG_KEY, problem.availableLanguages?.[0]?.lang) as string) || '';
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
        const meta = [result.time ? `Time: ${result.time}ms` : null, result.memory ? `Memory: ${result.memory}KB` : null]
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
    setSearchParams(next, {replace: true});
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
    return page.data.map((item) => ({id: item.id, title: item.title}));
  };

  const {data: problemOptions = []} = useSWR(['problem-switcher', debouncedProblemSearch], problemOptionsFetcher);

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
    return {id: problem.id, title: problem.title};
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
      await problemsQueries.problemsRepository.submitSolution(problem.id, {sourceCode: code, lang: selectedLang});
      enqueueSnackbar(t('problems.detail.submitSuccess'), {variant: 'success'});
      setActiveTab('attempts');
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', 'attempts');
        return next;
      });
      mutateAttempts();
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error?.message ?? t('problems.detail.error');
      enqueueSnackbar(message, {variant: 'error'});
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
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default'}}>
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          px: {xs: 2, md: 3},
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
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{minWidth: 0, flex: 1}}>
          <Logo showName={false}/>
          <Autocomplete
            size="small"
            sx={{minWidth: 240}}
            options={combinedProblemOptions}
            getOptionLabel={(option) => `${option.id}. ${option.title}`}
            onChange={handleProblemSelect}
            onInputChange={(_, value) => setProblemSearch(value)}
            filterOptions={(opts) => opts}
            value={selectedProblemOption}
            renderInput={(params) => (
              <TextField {...params} size="small" label={t('problems.detail.selectProblem')} placeholder="1234"/>
            )}
          />
          <Tooltip title={t('problems.detail.previousProblem')}>
            <span>
              <IconButton onClick={handlePrev} color="primary" disabled={!problem?.id}>
                <IconifyIcon icon="mdi:chevron-left"/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.nextProblem')}>
            <span>
              <IconButton onClick={handleNext} color="primary" disabled={!problem?.id}>
                <IconifyIcon icon="mdi:chevron-right"/>
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{flex: 1, minWidth: 0}}>
          <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.run')}>
            <span>
              <IconButton color="primary" onClick={handleRun} disabled={!currentUser || isRunning || !code}
                          size="large">
                <IconifyIcon icon="mdi:play-circle-outline" width={22} height={22}/>
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
                  <IconifyIcon icon="mdi:check-all" width={22} height={22}/>
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
                    <IconifyIcon icon="mdi:check-all" width={22} height={22}/>
                  </IconButton>
                </KepcoinSpendConfirm>
              </span>
            </Tooltip>
          )}

          {problem?.hasSolution && problem?.hasCheckInput ? (
            <Tooltip title={isAnswering ? t('problems.detail.waiting') : t('problems.detail.answerForInput')}>
              <span>
                <KepcoinSpendConfirm
                  value={1}
                  purchaseUrl={`/api/problems/${problem?.id}/answer-for-input/`}
                  requestBody={{input_data: input}}
                  onSuccess={handleAnswerForInput}
                  disabled={!currentUser}
                >
                  <IconButton color="info" disabled={!currentUser || isAnswering} size="large">
                    <IconifyIcon icon="mdi:chat-question-outline" width={22} height={22}/>
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
                sx={{minWidth: 44, px: 1}}
              >
                <IconifyIcon icon="mdi:send-outline" width={18} height={18}/>
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Box sx={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
          <AppbarActionItems type="slim"/>
        </Box>
      </Box>

      <Card variant="outlined" sx={{flex: 1, m: {xs: 1, md: 2}, display: 'flex', flexDirection: 'column'}}>
        {isProblemLoading && <LinearProgress/>}

        <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
          <PanelGroup direction="horizontal" style={{flex: 1, minHeight: 0}}>
            <Panel defaultSize={50} minSize={35}>
              <Box sx={{height: '100%', overflow: 'auto', px: {xs: 2, md: 3}, py: 2}}>
                {problem ? (
                  <>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      textColor="primary"
                      indicatorColor="primary"
                      sx={{mb: 1.5}}
                    >
                      <Tab
                        value="description"
                        label={t('problems.detail.problemTab')}
                        icon={<IconifyIcon icon="mdi:book-open-page-variant" color="#7C4DFF"/>}
                        iconPosition="start"
                      />
                      <Tab
                        value="attempts"
                        label={t('problems.detail.attemptsTab')}
                        icon={<IconifyIcon icon="mdi:history" color="#0288D1"/>}
                        iconPosition="start"
                      />
                      <Tab
                        value="stats"
                        label={t('problems.detail.stats')}
                        icon={<IconifyIcon icon="mdi:chart-bar" color="#43A047"/>}
                        iconPosition="start"
                      />
                      <Tab
                        value="hacks"
                        label={t('problems.detail.hacksTab')}
                        icon={<IconifyIcon icon="mdi:sword-cross" color="#E53935"/>}
                        iconPosition="start"
                        disabled={!problem?.hasCheckInput}
                      />
                    </Tabs>

                    {activeTab === 'description' && (
                      <ProblemDescription
                        problem={problem}
                        selectedLanguage={selectedLanguage}
                        selectedDifficultyColor={selectedDifficultyColor}
                      />
                    )}

                    {activeTab === 'attempts' && (
                      <Card variant="outlined" sx={{mt: 2}}>
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

                    {activeTab === 'stats' && <ProblemStatisticsTab problemId={problem.id}/>}

                    {activeTab === 'hacks' && (
                      <HackAttemptsCard
                        attempts={hackAttemptsPage?.data ?? []}
                        total={hackAttemptsPage?.total ?? 0}
                        pagination={hackPagination}
                        onPaginationChange={setHackPagination}
                        onRefresh={() => mutateHackAttempts()}
                      />
                    )}

                    <ProblemFooter
                      problem={problem}
                      onFavoriteToggle={handleFavoriteToggle}
                      onLike={() => handleLikeDislike('like')}
                      onDislike={() => handleLikeDislike('dislike')}
                    />
                  </>
                ) : (
                  <Typography color="text.secondary">{t('problems.detail.noProblem')}</Typography>
                )}
              </Box>
            </Panel>

            <PanelHandle/>

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
                onAnswerForInput={handleAnswerForInput}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                isCheckingSamples={isCheckingSamples}
                isAnswering={isAnswering}
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

interface ProblemHeaderProps {
  problem: ProblemDetail;
  selectedDifficultyColor: string;
}

const ProblemHeader = ({problem, selectedDifficultyColor}: ProblemHeaderProps) => {
  const {t} = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="h5" fontWeight={800} sx={{mr: 1}}>
            {problem.id}. {problem.title}
          </Typography>
          <Chip label={problem.difficultyTitle} color={selectedDifficultyColor as any} size="small"/>
          <Chip
            label={`${t('problems.detail.timeLimit')}: ${problem.timeLimit ?? problem.availableLanguages?.[0]?.timeLimit ?? 0} ms`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`${t('problems.detail.memoryLimit')}: ${problem.memoryLimit ?? problem.availableLanguages?.[0]?.memoryLimit ?? 0} MB`}
            variant="outlined"
            size="small"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const ProblemFooter = ({
                         problem,
                         onFavoriteToggle,
                         onLike,
                         onDislike,
                       }: {
  problem: ProblemDetail;
  onFavoriteToggle: () => void;
  onLike: () => void;
  onDislike: () => void;
}) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        pt: 2,
        pb: 1.5,
        bgcolor: (theme) => `${theme.palette.background.default}CC`,
        backdropFilter: 'blur(6px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <UserPopover username={problem.authorUsername}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Avatar src={problem.authorAvatar} sx={{width: 28, height: 28}}/>
            <Typography variant="body2" fontWeight={700}>
              {problem.authorUsername}
            </Typography>
          </Stack>
        </UserPopover>

        <Chip
          label={problem.userInfo?.isFavorite ? t('problems.detail.favorited') : t('problems.detail.favorite')}
          color={problem.userInfo?.isFavorite ? 'warning' : 'default'}
          onClick={onFavoriteToggle}
          icon={<IconifyIcon icon="mdi:star-outline"/>}
          size="small"
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant={problem.userInfo?.voteType === 1 ? 'contained' : 'outlined'}
            color="success"
            size="small"
            onClick={onLike}
            startIcon={<IconifyIcon icon="mdi:thumb-up-outline"/>}
          >
            {problem.likesCount ?? 0}
          </Button>
          <Button
            variant={problem.userInfo?.voteType === 0 ? 'contained' : 'outlined'}
            color="error"
            size="small"
            onClick={onDislike}
            startIcon={<IconifyIcon icon="mdi:thumb-down-outline"/>}
          >
            {problem.dislikesCount ?? 0}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

interface ProblemDescriptionProps {
  problem: ProblemDetail;
  selectedLanguage: any;
  selectedDifficultyColor: string;
}

const ProblemDescription = ({
                              problem,
                              selectedLanguage,
                              selectedDifficultyColor,
                            }: ProblemDescriptionProps) => {
  const {t} = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [solutionExpanded, setSolutionExpanded] = useState(false);
  const {data: solution, isLoading: isSolutionLoading} = useProblemSolution(problem.id, solutionExpanded);

  useEffect(() => {
    if (!contentRef.current) return;

    if (!(window as any).MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => (window as any).MathJax?.typeset?.([contentRef.current]);
      document.head.appendChild(script);
      return;
    }
    (window as any).MathJax?.typeset?.([contentRef.current]);
  }, [problem.body, problem.inputData, problem.outputData, problem.comment]);

  return (
    <Box mt={2}>
      <ProblemHeader problem={problem} selectedDifficultyColor={selectedDifficultyColor}/>
      <Card variant="outlined">
        <CardContent>
          <Box ref={contentRef} className="problem-body">
            <Typography variant="body1" color="text.primary" dangerouslySetInnerHTML={{__html: problem.body ?? ''}}/>

            {problem.inputData ? (
              <Box mt={3}>
                <Typography variant="h6">{t('problems.detail.inputData')}</Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{__html: problem.inputData}}/>
              </Box>
            ) : null}

            {problem.outputData ? (
              <Box mt={3}>
                <Typography variant="h6">{t('problems.detail.outputData')}</Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{__html: problem.outputData}}/>
              </Box>
            ) : null}

            {problem.sampleTests?.length ? (
              <Box mt={3}>
                <Typography variant="h6" mb={1}>
                  {t('problems.detail.sampleTests')}
                </Typography>
                <Stack direction="column" spacing={2}>
                  {problem.sampleTests.map((test, index) => (
                    <Card key={`${test.input}-${index}`} variant="outlined">
                      <CardContent>
                        <Stack spacing={2}>
                          <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography fontWeight={700}>
                                {t('problems.detail.input')} #{index + 1}
                              </Typography>
                              <IconButton size="small" onClick={() => navigator.clipboard.writeText(test.input ?? '')}>
                                <IconifyIcon icon="mdi:content-copy" width={16} height={16}/>
                              </IconButton>
                            </Stack>
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {test.input}
                            </Box>
                          </Box>
                          <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography fontWeight={700}>{t('problems.detail.expectedOutput')}</Typography>
                              <IconButton size="small" onClick={() => navigator.clipboard.writeText(test.output ?? '')}>
                                <IconifyIcon icon="mdi:content-copy" width={16} height={16}/>
                              </IconButton>
                            </Stack>
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {test.output}
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ) : null}

            {problem.comment ? (
              <Box mt={3}>
                <Typography variant="h6" mb={1}>
                  {t('problems.detail.comment')}
                </Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{__html: problem.comment}}/>
              </Box>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {(problem.tags?.length || problem.topics?.length) ? (
        <Accordion sx={{mt: 2}} defaultExpanded>
          <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill"/>}>
            <Typography fontWeight={700}>{t('problems.detail.tagsTopics')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(problem.tags ?? []).map((tag) => (
                <Chip key={tag.id} label={tag.name} variant="outlined" size="small"/>
              ))}
              {(problem.topics ?? []).map((topic) => (
                <Chip key={topic.id} label={topic.name} color="info" size="small"/>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : null}

      {problem.hasSolution ? (
        <Accordion
          sx={{mt: 2}}
          expanded={solutionExpanded}
          onChange={(_, expanded) => setSolutionExpanded(expanded)}
        >
          <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill"/>}>
            <Typography fontWeight={700}>{t('problems.detail.solution')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isSolutionLoading ? (
              <LinearProgress/>
            ) : solution ? (
              <Stack spacing={2}>
                <Typography dangerouslySetInnerHTML={{__html: solution.solution}}/>
                {solution.codes.map((code) => (
                  <Card key={code.lang} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {code.lang}
                      </Typography>
                      <Box
                        sx={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {code.code}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">{t('problems.detail.noSolution')}</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ) : null}

    </Box>
  );
};

interface HackAttemptsCardProps {
  attempts: HackAttempt[];
  total: number;
  pagination: { page: number; pageSize: number };
  onPaginationChange: (value: { page: number; pageSize: number }) => void;
  onRefresh: () => void;
}

const ProblemStatisticsTab = ({problemId}: { problemId: number }) => {
  const {t} = useTranslation();
  const {data: stats, isLoading} = useProblemStatistics(problemId);

  return (
    <Card variant="outlined" sx={{mt: 2}}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('problems.detail.stats')}
        </Typography>
        {isLoading ? (
          <LinearProgress/>
        ) : stats ? (
          <Stack spacing={2}>
            <Stack spacing={1}>
              {(stats.attemptStatistics ?? []).map((item) => (
                <Stack key={item.verdictTitle} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">{item.verdictTitle}</Typography>
                  <Typography fontWeight={700}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
            <Divider/>
            <Stack spacing={1}>
              {(stats.languageStatistics ?? []).map((item) => (
                <Stack key={item.lang} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">{item.langFull}</Typography>
                  <Typography fontWeight={700}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Typography color="text.secondary">{t('problems.detail.noStatistics')}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const HackAttemptsCard = ({attempts, total, pagination, onPaginationChange, onRefresh}: HackAttemptsCardProps) => {
  const {t} = useTranslation();
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pagination.pageSize || 1)));

  return (
    <Card variant="outlined" sx={{mt: 2}}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">{t('problems.detail.hackAttempts')}</Typography>
          <Button onClick={onRefresh} startIcon={<IconifyIcon icon="mdi:refresh"/>} size="small">
            {t('problems.detail.refresh')}
          </Button>
        </Stack>

        {attempts.length === 0 ? (
          <Typography color="text.secondary">{t('problems.detail.noHackAttempts')}</Typography>
        ) : (
          <Stack direction="column" spacing={1.5}>
            {attempts.map((attempt) => (
              <Card key={attempt.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" color="text.secondary">
                        #{attempt.id} {attempt.hackType}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {attempt.problemId}. {attempt.problemTitle}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1.5} mt={1} flexWrap="wrap">
                    <Chip
                      icon={<IconifyIcon icon="mdi:sword-cross" width={16} height={16}/>}
                      label={`${t('problems.detail.hacker')}: ${attempt.hackerUsername}`}
                      size="small"
                    />
                    <Chip
                      icon={<IconifyIcon icon="mdi:shield-outline" width={16} height={16}/>}
                      label={`${t('problems.detail.defender')}: ${attempt.defenderUsername}`}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onPaginationChange({page: Math.max(0, pagination.page - 1), pageSize: pagination.pageSize})}
            disabled={pagination.page === 0}
          >
            {t('problems.detail.previous')}
          </Button>
          <Typography variant="body2">
            {pagination.page + 1}/{totalPages}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              onPaginationChange({
                page: Math.min(totalPages - 1, pagination.page + 1),
                pageSize: pagination.pageSize,
              })
            }
            disabled={pagination.page + 1 >= totalPages}
          >
            {t('problems.detail.next')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

interface ProblemEditorPanelProps {
  problem?: ProblemDetail;
  code: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  sampleTests: ProblemSampleTest[];
  selectedSampleIndex: number;
  onSampleChange: (value: number) => void;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  answer: string;
  onRun: () => void;
  onSubmit: () => void;
  onCheckSamples: () => void;
  onAnswerForInput: (payload?: any) => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isCheckingSamples: boolean;
  isAnswering: boolean;
  checkSamplesResult: Array<{ verdict: number; input?: string; output?: string; answer?: string }>;
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  currentUser: any;
  canUseCheckSamples: boolean;
  editorTheme: string;
}

const ProblemEditorPanel = ({
                              problem,
                              code,
                              onCodeChange,
                              selectedLang,
                              onLangChange,
                              sampleTests,
                              selectedSampleIndex,
                              onSampleChange,
                              input,
                              onInputChange,
                              output,
                              answer,
                              onRun,
                              onSubmit,
                              onCheckSamples,
                              onAnswerForInput,
                              isRunning,
                              isSubmitting,
                              isCheckingSamples,
                              isAnswering,
                              checkSamplesResult,
                              editorTab,
                              onEditorTabChange,
                              currentUser,
                              canUseCheckSamples,
                              editorTheme,
                            }: ProblemEditorPanelProps) => {
  const {t} = useTranslation();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(editorTheme);
    }
  }, [monaco, editorTheme]);

  if (!currentUser) {
    return (
      <Box sx={{height: '100%', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Card variant="outlined" sx={{maxWidth: 520}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('problems.detail.signInToSolve')}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {t('problems.detail.signInSubtitle')}
            </Typography>
            <Button component={RouterLink} to={resources.Login} variant="contained">
              {t('auth.login')}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{height: '100%', p: {xs: 2, md: 3}, bgcolor: 'background.default'}}>
      <Tabs
        value="code"
        textColor="primary"
        indicatorColor="primary"
        sx={{mb: 1}}
      >
        <Tab
          value="code"
          label={t('problems.detail.codeTab', {defaultValue: 'Code'})}
          icon={<IconifyIcon icon="mdi:code-tags" color="#7E57C2"/>}
          iconPosition="start"
        />
      </Tabs>
      <Stack direction={{xs: 'column', md: 'row'}} spacing={1.5} alignItems="center" mb={1.5}>
        <TextField
          select
          size="small"
          label={t('problems.detail.language')}
          value={selectedLang}
          onChange={(event) => onLangChange(event.target.value)}
          sx={{minWidth: 180}}
        >
          {problem?.availableLanguages?.map((lang) => (
            <MenuItem key={lang.lang} value={lang.lang}>
              {lang.langFull || lang.lang}
            </MenuItem>
          ))}
        </TextField>

        {sampleTests.length ? (
          <TextField
            select
            size="small"
            label={t('problems.detail.sample')}
            value={selectedSampleIndex}
            onChange={(event) => onSampleChange(Number(event.target.value))}
            sx={{minWidth: 140}}
          >
            {sampleTests.map((_, index) => (
              <MenuItem key={index} value={index}>
                #{index + 1}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Stack>

      <PanelGroup direction="vertical" style={{height: 'calc(100% - 40px)'}}>
        <Panel defaultSize={65} minSize={45}>
          <Box
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Editor
              key={editorTheme}
              language={getEditorLanguage(selectedLang)}
              value={code}
              onChange={(value) => onCodeChange(value ?? '')}
              options={{
                minimap: {enabled: false},
                fontSize: 14,
              }}
              theme={editorTheme}
              loading={<LinearProgress/>}
              height="100%"
            />
          </Box>
        </Panel>

        <VerticalHandle/>

        <Panel defaultSize={35} minSize={25}>
          <Card variant="outlined" sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Tabs
              value={editorTab}
              onChange={(_, value) => onEditorTabChange(value)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="console" label={t('problems.detail.console')}/>
              <Tab value="samples" label={t('problems.detail.samplesResult')}/>
            </Tabs>

            <Box sx={{flex: 1, overflow: 'auto', p: 2}}>
              {editorTab === 'console' ? (
                <Stack direction="column" spacing={1.5}>
                  <TextField
                    multiline
                    minRows={3}
                    label={t('problems.detail.customInput')}
                    value={input}
                    onChange={(event) => onInputChange(event.target.value)}
                  />
                  <Stack direction={{xs: 'column', md: 'row'}} spacing={1.5}>
                    <TextField
                      fullWidth
                      label={t('problems.detail.yourOutput')}
                      multiline
                      minRows={4}
                      value={output}
                      InputProps={{readOnly: true}}
                    />
                    <TextField
                      fullWidth
                      label={t('problems.detail.answer')}
                      multiline
                      minRows={4}
                      value={answer}
                      InputProps={{readOnly: true}}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.run')}>
                      <span>
                        <IconButton
                          color="primary"
                          onClick={onRun}
                          disabled={isRunning || !code}
                          size="large"
                        >
                          <IconifyIcon icon="mdi:play-circle-outline" width={20} height={20}/>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('problems.detail.checkSamples')}>
                      <span>
                        <IconButton
                          color="secondary"
                          onClick={onCheckSamples}
                          disabled={isCheckingSamples || !canUseCheckSamples || !code}
                          size="large"
                        >
                          <IconifyIcon icon="mdi:check-all" width={20} height={20}/>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('problems.detail.submit')}>
                      <span>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={onSubmit}
                          disabled={isSubmitting || !code}
                          sx={{minWidth: 44, px: 1}}
                        >
                          <IconifyIcon icon="mdi:send-outline" width={18} height={18}/>
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="column" spacing={1}>
                  {checkSamplesResult.length === 0 ? (
                    <Typography color="text.secondary">{t('problems.detail.noSamplesResult')}</Typography>
                  ) : (
                    checkSamplesResult.map((result, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2">#{index + 1}</Typography>
                          </Stack>
                          {result.input ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.customInput')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.input}
                              </Typography>
                            </Box>
                          ) : null}
                          {result.output ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.yourOutput')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.output}
                              </Typography>
                            </Box>
                          ) : null}
                          {result.answer ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.answer')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.answer}
                              </Typography>
                            </Box>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              )}
            </Box>
          </Card>
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default ProblemDetailPage;
