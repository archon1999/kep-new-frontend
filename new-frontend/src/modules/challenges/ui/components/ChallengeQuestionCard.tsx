import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GridArrowDownwardIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Question, QuestionOption, QuestionType } from 'modules/testing/domain';

interface ChallengeQuestionCardProps {
  question?: Question;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (answer: unknown) => void;
}

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

const ChallengeQuestionCard = ({ question, onSubmit, disabled, isSubmitting }: ChallengeQuestionCardProps) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerState>>({});

  useEffect(() => {
    if (!question) return;
    setAnswers({ [question.id]: buildInitialState(question) });
  }, [question]);

  const currentAnswer = useMemo(() => (question ? answers[question.id] : undefined), [answers, question]);

  const updateAnswer = (updater: (prev: QuestionAnswerState) => QuestionAnswerState) => {
    if (!question) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: updater(prev[question.id] ?? { type: question.type }),
    }));
  };

  const toggleMulti = (index: number) => {
    updateAnswer((prev) => {
      const next = new Set(prev.selectedMulti ?? []);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { ...prev, selectedMulti: next };
    });
  };

  const moveOrderingItem = (index: number, direction: -1 | 1) => {
    updateAnswer((prev) => {
      const order = [...(prev.order ?? [])];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= order.length) return prev;
      const [item] = order.splice(index, 1);
      order.splice(newIndex, 0, item);
      return { ...prev, order };
    });
  };

  const updateClassification = (value: string, key: string) => {
    updateAnswer((prev) => {
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

  const handleSubmit = () => {
    if (!question) return;
    const answerPayload = buildAnswerPayload(question, currentAnswer);

    if (answerPayload.isEmpty) return;

    onSubmit?.(answerPayload.answer);
  };

  if (!question) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Stack spacing={1} direction="column">
            <Typography variant="overline" color="text.secondary">
              {t('challenges.questionNumber', { number: question.number })}
            </Typography>
            <Typography variant="h6">{question.text}</Typography>
          </Stack>

          {question.type === QuestionType.SingleChoice && (
            <Stack spacing={1} direction="column">
              {question.options?.map((option, index) => (
                <Chip
                  key={option.option}
                  label={option.option}
                  color={currentAnswer?.selectedIndex === index ? 'primary' : 'default'}
                  variant={currentAnswer?.selectedIndex === index ? 'filled' : 'outlined'}
                  onClick={() => updateAnswer(() => ({ type: QuestionType.SingleChoice, selectedIndex: index }))}
                  disabled={disabled}
                />
              ))}
            </Stack>
          )}

          {question.type === QuestionType.MultipleChoice && (
            <Stack spacing={1} direction="column">
              {question.options?.map((option, index) => (
                <Chip
                  key={option.option}
                  label={option.option}
                  color={currentAnswer?.selectedMulti?.has(index) ? 'primary' : 'default'}
                  variant={currentAnswer?.selectedMulti?.has(index) ? 'filled' : 'outlined'}
                  onClick={() => toggleMulti(index)}
                  disabled={disabled}
                />
              ))}
            </Stack>
          )}

          {(question.type === QuestionType.TextInput || question.type === QuestionType.CodeInput) && (
            <TextField
              fullWidth
              multiline={question.type === QuestionType.CodeInput}
              minRows={question.type === QuestionType.CodeInput ? 4 : 1}
              label={t('challenges.yourAnswer')}
              value={currentAnswer?.value ?? ''}
              onChange={(event) =>
                updateAnswer(() => ({ type: question.type, value: event.target.value }))
              }
              disabled={disabled}
            />
          )}

          {question.type === QuestionType.Conformity && (
            <Stack spacing={1} direction="column">
              {question.options?.map((option, index) => (
                <Stack key={option.optionMain} direction="row" spacing={1} alignItems="center">
                  <Typography minWidth={140}>{option.optionMain}</Typography>
                  <Select
                    value={currentAnswer?.matches?.[index] ?? ''}
                    onChange={(event) =>
                      updateAnswer((prev) => {
                        const matches = [...(prev.matches ?? [])];
                        matches[index] = event.target.value as string;
                        return { ...prev, matches };
                      })
                    }
                    size="small"
                    disabled={disabled}
                  >
                    {question.options?.map((candidate) => (
                      <MenuItem key={candidate.optionSecondary} value={candidate.optionSecondary}>
                        {candidate.optionSecondary}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              ))}
            </Stack>
          )}

          {question.type === QuestionType.Ordering && (
            <Stack spacing={1} direction="column">
              {currentAnswer?.order?.map((option, index) => (
                <Stack key={option} direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ minWidth: 24 }}>{index + 1}.</Typography>
                  <Typography sx={{ flexGrow: 1 }}>{option}</Typography>
                  <IconButton size="small" onClick={() => moveOrderingItem(index, -1)} disabled={disabled}>
                    <GridArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => moveOrderingItem(index, 1)} disabled={disabled}>
                    <GridArrowDownwardIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}

          {question.type === QuestionType.Classification && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Stack spacing={1} direction="column" flex={1}>
                <Typography variant="subtitle2">{t('challenges.labels')}</Typography>
                {Object.keys(currentAnswer?.assignment ?? {}).map((key) => (
                  <Stack key={key} spacing={0.5} direction="column">
                    <Typography variant="body2" fontWeight={600}>
                      {key}
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {currentAnswer?.assignment?.[key]?.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          onClick={() => updateClassification(value, key)}
                          disabled={disabled}
                        />
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>

              <Stack spacing={1} direction="column" flex={1}>
                <Typography variant="subtitle2">{t('challenges.pool')}</Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {(question.options ?? []).map((option: QuestionOption) => (
                    <Chip
                      key={`${option.optionMain}-${option.optionSecondary}`}
                      label={`${option.optionSecondary}`}
                      onClick={() => updateClassification(option.optionSecondary ?? '', option.optionMain ?? '')}
                      disabled={disabled}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>
          )}

          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit} disabled={disabled || isSubmitting}>
              {t('challenges.submitAnswer')}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeQuestionCard;
