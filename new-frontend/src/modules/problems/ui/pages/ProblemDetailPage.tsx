import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Card, CircularProgress, LinearProgress } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { alpha } from '@mui/material/styles';
import { getItemFromStore, setItemToStore } from 'shared/lib/utils';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import {
  problemsQueries,
  useAttemptsList,
  useHackAttempts,
  useProblemDetail,
} from '../../application/queries';
import { ProblemSampleTest } from '../../domain/entities/problem.entity';
import { AttemptsListParams, HackAttemptsListParams } from '../../domain/ports/problems.repository';
import { PanelHandle } from '../components/problem-detail/PanelHandles';
import { ProblemDescription } from '../components/problem-detail/ProblemDescription';
import ProblemDescriptionSkeleton from '../components/problem-detail/ProblemDescriptionSkeleton';
import { ProblemEditorPanel } from '../components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from '../components/problem-detail/ProblemEditorSkeleton';
import { ProblemHeader } from '../components/problem-detail/ProblemHeader';
import { VerdictKey } from 'shared/components/problems/AttemptVerdict';

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
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const themeMode = useThemeMode();
  const permissions = useProblemPermissions(currentUser?.permissions);
  const [editorTheme, setEditorTheme] = useState<'kep-light' | 'kep-dark'>(
    themeMode.mode === 'dark' ? 'kep-dark' : 'kep-light',
  );
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    setEditorTheme(themeMode.mode === 'dark' ? 'kep-dark' : 'kep-light');
  }, [themeMode.mode]);

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
    Array<{ verdict?: VerdictKey; verdictTitle?: string; input?: string; output?: string; answer?: string }>
  >([]);
  const [editorTab, setEditorTab] = useState<'console' | 'samples'>('console');
  const [myAttemptsOnly, setMyAttemptsOnly] = useState(true);
  const [hackPagination, setHackPagination] = useState({ page: 0, pageSize: 10 });
  const [attemptsPagination, setAttemptsPagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const {
    data: problem,
    isLoading: isProblemLoading,
    isValidating: isProblemValidating,
    mutate: mutateProblem,
  } = useProblemDetail(Number.isNaN(problemId) ? undefined : problemId);

  useEffect(() => {
    if (problem?.id) {
      setHasLoadedOnce(true);
    }
  }, [problem?.id]);

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
    setSelectedSampleIndex(0);
    setInput('');
    setOutput('');
    setAnswer('');
    setCheckSamplesResult([]);
    setEditorTab('console');
  }, [problem?.id]);

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
  }, [t]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'attempts' || tab === 'hacks' || tab === 'stats') {
      setActiveTab(tab);
    } else {
      setActiveTab('description');
    }
  }, [searchParams]);

  const handleTabChange = (value: 'description' | 'attempts' | 'hacks' | 'stats') => {
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

  const handleSubmit = async () => {
    if (!problem?.id || !selectedLang || !code || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await problemsQueries.problemsRepository.submitSolution(problem.id, {
        sourceCode: code,
        lang: selectedLang,
      });
      toast.success(t('problems.detail.submitSuccess'));
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
      toast.error(message);
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
  const canUseCheckSamples = Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser);
  const showInitialSkeleton = !hasLoadedOnce && (isProblemLoading || !problem);
  const isRevalidating = Boolean(problem) && hasLoadedOnce && (isProblemValidating || isProblemLoading);

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
      <ProblemHeader
        onPrev={handlePrev}
        onNext={handleNext}
        canNavigate={Boolean(problem?.id)}
        problemId={problemId}
        problem={problem}
        currentUser={currentUser}
        hasCode={Boolean(code)}
        isRunning={isRunning}
        isCheckingSamples={isCheckingSamples}
        isAnswering={isAnswering}
        isSubmitting={isSubmitting}
        onRun={handleRun}
        onCheckSamples={handleCheckSamples}
        onAnswerForInput={handleAnswerForInput}
        onSubmit={handleSubmit}
        onRefreshProblem={() => mutateProblem()}
        canUseCheckSamples={canUseCheckSamples}
        showAnswerForInput={Boolean(problem?.hasSolution && problem?.hasCheckInput)}
        inputValue={input}
      />

      <Card
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 0,
        }}
        aria-busy={isProblemLoading}
      >
        {isProblemLoading ? (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        ) : null}

        {isRevalidating ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              bgcolor: (theme) =>
                alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === 'dark' ? 0.3 : 0.45,
                ),
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : null}

        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={50} minSize={35}>
            {problem && !showInitialSkeleton ? (
              <ProblemDescription
                problem={problem}
                selectedDifficultyColor={selectedDifficultyColor}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                currentUser={currentUser}
                myAttemptsOnly={myAttemptsOnly}
                onToggleMyAttempts={() => setMyAttemptsOnly((prev) => !prev)}
                attempts={attemptsPage?.data ?? []}
                attemptsTotal={attemptsPage?.total ?? 0}
                attemptsPagination={attemptsPagination}
                onAttemptsPaginationChange={setAttemptsPagination}
                isAttemptsLoading={isAttemptsLoading}
                onAttemptsRefresh={() => mutateAttempts()}
                hackAttempts={hackAttemptsPage?.data ?? []}
                hackTotal={hackAttemptsPage?.total ?? 0}
                hackPagination={hackPagination}
                onHackPaginationChange={setHackPagination}
                onHackRefresh={() => mutateHackAttempts()}
                onFavoriteToggle={handleFavoriteToggle}
                onLike={() => handleLikeDislike('like')}
                onDislike={() => handleLikeDislike('dislike')}
              />
            ) : (
              <ProblemDescriptionSkeleton />
            )}
          </Panel>

          <PanelHandle />

          <Panel defaultSize={50} minSize={35}>
            {problem && !showInitialSkeleton ? (
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
                canUseCheckSamples={canUseCheckSamples}
                editorTheme={editorTheme}
              />
            ) : (
              <ProblemEditorSkeleton />
            )}
          </Panel>
        </PanelGroup>
      </Card>
    </Box>
  );
};

export default ProblemDetailPage;
