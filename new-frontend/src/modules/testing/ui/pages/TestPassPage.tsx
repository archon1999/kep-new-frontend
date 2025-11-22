import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { finishTest, submitAnswer, testingMutations } from '../../application/mutations.ts';
import { useTestPass } from '../../application/queries.ts';
import { Question, QuestionOption, QuestionType } from '../../domain';
import { getResourceById, resources } from 'app/routes/resources';
import { GridArrowDownwardIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';

interface QuestionAnswerState {
  type: QuestionType;
  selectedIndex?: number;
  selectedMulti?: Set<number>;
  value?: string;
  matches?: string[];
  order?: string[];
  assignment?: Record<string, string[]>;
}

const buildInitialState = (question: Question): QuestionAnswerState => {
  switch (question.type) {
    case QuestionType.SingleChoice:
      return { type: question.type, selectedIndex: question.options?.findIndex((o) => o.selected) ?? -1 };
    case QuestionType.MultipleChoice:
      return {
        type: question.type,
        selectedMulti: new Set(
          question.options?.reduce<number[]>((acc, option, index) => {
            if (option.selected) acc.push(index);
            return acc;
          }, []) ?? [],
        ),
      };
    case QuestionType.TextInput:
    case QuestionType.CodeInput:
      return { type: question.type, value: question.input ?? '' };
    case QuestionType.Conformity: {
      const matches = question.options?.map((option) => option.optionSecondary ?? '') ?? [];
      return { type: question.type, matches };
    }
    case QuestionType.Ordering: {
      const order = question.options?.map((option) => option.option ?? option.optionSecondary ?? '') ?? [];
      return { type: question.type, order };
    }
    case QuestionType.Classification: {
      const keys = new Set<string>();
      question.options?.forEach((option) => keys.add(option.optionMain ?? ''));
      const assignment: Record<string, string[]> = {};
      keys.forEach((key) => {
        assignment[key] = [];
      });
      question.options?.forEach((option) => {
        const key = option.optionMain ?? '';
        if (!assignment[key]) assignment[key] = [];
        assignment[key].push(option.optionSecondary ?? '');
      });
      return { type: question.type, assignment };
    }
    default:
      return { type: question.type };
  }
};

const buildAnswerPayload = (question: Question, state?: QuestionAnswerState) => {
  if (!state) return { isEmpty: true, answer: null };

  switch (question.type) {
    case QuestionType.SingleChoice: {
      const answer = typeof state.selectedIndex === 'number' ? state.selectedIndex : -1;
      return { answer, isEmpty: answer === -1 };
    }
    case QuestionType.MultipleChoice: {
      const answer = Array.from(state.selectedMulti ?? []);
      return { answer, isEmpty: answer.length === 0 };
    }
    case QuestionType.TextInput:
    case QuestionType.CodeInput: {
      const answer = state.value ?? '';
      return { answer, isEmpty: !answer };
    }
    case QuestionType.Conformity: {
      const group_one = question.options?.map((option) => option.optionMain ?? '') ?? [];
      const group_two = state.matches ?? [];
      return { answer: { group_one, group_two }, isEmpty: !group_one.length || !group_two.length };
    }
    case QuestionType.Ordering: {
      const ordering_list = state.order ?? [];
      return { answer: { ordering_list }, isEmpty: ordering_list.length === 0 };
    }
    case QuestionType.Classification: {
      const classification_groups = Object.entries(state.assignment ?? {}).map(([key, values]) => ({
        key,
        values,
      }));
      return { answer: { classification_groups }, isEmpty: classification_groups.length === 0 };
    }
    default:
      return { answer: null, isEmpty: true };
  }
};

const TestPassPage = () => {
  const { id: testPassId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { data: testPass, isLoading } = useTestPass(testPassId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!testPass?.test?.questions?.length) return;

    const hydrated = testPass.test.questions.map((question) =>
      testingMutations.testingRepository.hydrateQuestion(question),
    );
    const mappedAnswers: Record<number, QuestionAnswerState> = {};
    hydrated.forEach((question) => {
      mappedAnswers[question.id] = buildInitialState(question);
    });

    setQuestions(hydrated);
    setAnswers(mappedAnswers);
    setCurrentIndex(0);
  }, [testPass?.test?.questions]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const updateAnswer = (questionId: number, updater: (prev: QuestionAnswerState) => QuestionAnswerState) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: updater(prev[questionId] ?? { type: currentQuestion?.type ?? QuestionType.SingleChoice }),
    }));
  };

  const toggleMulti = (questionId: number, index: number) => {
    updateAnswer(questionId, (prev) => {
      const next = new Set(prev.selectedMulti ?? []);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { ...prev, selectedMulti: next };
    });
  };

  const moveOrderingItem = (questionId: number, index: number, direction: -1 | 1) => {
    updateAnswer(questionId, (prev) => {
      const order = [...(prev.order ?? [])];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= order.length) return prev;
      const [item] = order.splice(index, 1);
      order.splice(newIndex, 0, item);
      return { ...prev, order };
    });
  };

  const updateClassification = (questionId: number, value: string, key: string) => {
    updateAnswer(questionId, (prev) => {
      const assignment: Record<string, string[]> = Object.entries(prev.assignment ?? {}).reduce(
        (acc, [groupKey, values]) => ({
          ...acc,
          [groupKey]: values.filter((v) => v !== value),
        }),
        {},
      );

      if (!assignment[key]) assignment[key] = [];
      assignment[key] = [...assignment[key], value];

      return { ...prev, assignment };
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !testPass) return;

    const answerPayload = buildAnswerPayload(currentQuestion, answers[currentQuestion.id]);

    if (answerPayload.isEmpty) {
      enqueueSnackbar(t('tests.fillAnswer'), { variant: 'warning' });
      return;
    }

    await submitAnswer(testPass.id, currentQuestion.number, answerPayload.answer);

    setQuestions((prev) =>
      prev.map((question) =>
        question.id === currentQuestion.id ? { ...question, answered: true } : question,
      ),
    );

    setCurrentIndex((prev) => (prev + 1) % questions.length);
    enqueueSnackbar(t('tests.answerSaved'), { variant: 'success' });
  };

  const handleFinish = async () => {
    if (!testPass) return;

    const response = await finishTest(testPass.id);

    if (response.success) {
      enqueueSnackbar(t('tests.finishSuccess', { result: response.result }), { variant: 'success' });
      navigate(getResourceById(resources.Test, testPass.test.id));
    } else {
      enqueueSnackbar(t('tests.finishError'), { variant: 'error' });
    }
  };

  if (isLoading || !currentQuestion) {
    return (
      <Box sx={{ ...responsivePagePaddingSx, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const currentAnswer = answers[currentQuestion.id];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800}>
            {testPass?.test.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}>
              {t('tests.previous')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              {t('tests.next')}
            </Button>
            <Button variant="contained" color="success" onClick={handleFinish}>
              {t('tests.finish')}
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('tests.questionLabel', { index: currentQuestion.number + 1, total: questions.length })}
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {currentQuestion.text}
              </Typography>

              {currentQuestion.type === QuestionType.SingleChoice && (
                <Stack spacing={1}>
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={option.option ?? index}
                      variant={currentAnswer?.selectedIndex === index ? 'contained' : 'outlined'}
                      onClick={() =>
                        updateAnswer(currentQuestion.id, (prev) => ({ ...prev, selectedIndex: index }))
                      }
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {option.option ?? option.optionSecondary ?? ''}
                    </Button>
                  ))}
                </Stack>
              )}

              {currentQuestion.type === QuestionType.MultipleChoice && (
                <Stack spacing={1}>
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={option.option ?? index}
                      variant={currentAnswer?.selectedMulti?.has(index) ? 'contained' : 'outlined'}
                      onClick={() => toggleMulti(currentQuestion.id, index)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {option.option ?? option.optionSecondary ?? ''}
                    </Button>
                  ))}
                </Stack>
              )}

              {(currentQuestion.type === QuestionType.TextInput ||
                currentQuestion.type === QuestionType.CodeInput) && (
                <TextField
                  multiline
                  minRows={4}
                  value={currentAnswer?.value ?? ''}
                  onChange={(event) =>
                    updateAnswer(currentQuestion.id, (prev) => ({ ...prev, value: event.target.value }))
                  }
                  placeholder={t('tests.answerPlaceholder')}
                />
              )}

              {currentQuestion.type === QuestionType.Conformity && (
                <Stack spacing={2}>
                  {currentQuestion.options?.map((option, index) => (
                    <Stack key={option.optionMain ?? index} direction="row" spacing={2} alignItems="center">
                      <Typography sx={{ minWidth: 200 }}>{option.optionMain}</Typography>
                      <Select
                        value={currentAnswer?.matches?.[index] ?? ''}
                        onChange={(event) =>
                          updateAnswer(currentQuestion.id, (prev) => {
                            const matches = [...(prev.matches ?? [])];
                            matches[index] = event.target.value as string;
                            return { ...prev, matches };
                          })
                        }
                        sx={{ minWidth: 200 }}
                      >
                        {(currentQuestion.options ?? []).map((secondary: QuestionOption, secIndex) => (
                          <MenuItem key={`${secondary.optionSecondary}-${secIndex}`} value={secondary.optionSecondary}>
                            {secondary.optionSecondary}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  ))}
                </Stack>
              )}

              {currentQuestion.type === QuestionType.Ordering && (
                <Stack spacing={1}>
                  {(currentAnswer?.order ?? []).map((item, index) => (
                    <Stack
                      key={`${item}-${index}`}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ bgcolor: 'background.neutral', px: 1.5, py: 1, borderRadius: 1 }}
                    >
                      <Typography sx={{ flex: 1 }}>{item}</Typography>
                      <IconButton onClick={() => moveOrderingItem(currentQuestion.id, index, -1)} size="small">
                        <GridArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => moveOrderingItem(currentQuestion.id, index, 1)} size="small">
                        <GridArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              {currentQuestion.type === QuestionType.Classification && (
                <Stack spacing={2}>
                  {(currentQuestion.options ?? []).map((option, index) => (
                    <Stack key={`${option.optionSecondary}-${index}`} direction="row" spacing={2} alignItems="center">
                      <Chip label={option.optionSecondary} />
                      <Select
                        value={Object.entries(currentAnswer?.assignment ?? {}).find(([_, values]) =>
                          values.includes(option.optionSecondary ?? ''),
                        )?.[0] ?? ''}
                        displayEmpty
                        onChange={(event) =>
                          updateClassification(
                            currentQuestion.id,
                            option.optionSecondary ?? '',
                            event.target.value as string,
                          )
                        }
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="" disabled>
                          {t('tests.chooseGroup')}
                        </MenuItem>
                        {Object.keys(currentAnswer?.assignment ?? {}).map((groupKey) => (
                          <MenuItem key={groupKey} value={groupKey}>
                            {groupKey}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSubmitAnswer}>
                  {t('tests.submitAnswer')}
                </Button>
                {currentQuestion.answered ? (
                  <Chip color="success" label={t('tests.answered')} />
                ) : (
                  <Chip color="warning" label={t('tests.notAnswered')} />
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default TestPassPage;
