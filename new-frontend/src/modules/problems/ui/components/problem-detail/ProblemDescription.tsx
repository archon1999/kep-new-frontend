import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useProblemSolution } from 'modules/problems/application/queries.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ProblemDetail } from '../../../domain/entities/problem.entity';
import { ProblemHeader } from './ProblemHeader';

interface ProblemDescriptionProps {
  problem: ProblemDetail;
  selectedDifficultyColor: string;
}

export const ProblemDescription = ({
  problem,
  selectedDifficultyColor,
}: ProblemDescriptionProps) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [solutionExpanded, setSolutionExpanded] = useState(false);
  const { data: solution, isLoading: isSolutionLoading } = useProblemSolution(
    problem.id,
    solutionExpanded,
  );

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
    <Box>
      <ProblemHeader problem={problem} selectedDifficultyColor={selectedDifficultyColor} />
      <Card variant="outlined">
        <CardContent>
          <Box ref={contentRef} className="problem-body">
            <Typography
              variant="body1"
              color="text.primary"
              dangerouslySetInnerHTML={{ __html: problem.body ?? '' }}
            />

            {problem.inputData ? (
              <Box mt={3}>
                <Typography variant="h6">{t('problems.detail.inputData')}</Typography>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: problem.inputData }}
                />
              </Box>
            ) : null}

            {problem.outputData ? (
              <Box mt={3}>
                <Typography variant="h6">{t('problems.detail.outputData')}</Typography>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: problem.outputData }}
                />
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
                        <Stack direction="column" spacing={2}>
                          <Box>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography fontWeight={700}>
                                {t('problems.detail.input')}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(test.input ?? '')}
                              >
                                <IconifyIcon icon="mdi:content-copy" width={16} height={16} />
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
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography fontWeight={700}>
                                {t('problems.detail.expectedOutput')}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(test.output ?? '')}
                              >
                                <IconifyIcon icon="mdi:content-copy" width={16} height={16} />
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
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: problem.comment }} />
              </Box>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {problem.tags?.length || problem.topics?.length ? (
        <Accordion sx={{ mt: 2 }} defaultExpanded>
          <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}>
            <Typography fontWeight={700}>{t('problems.detail.tagsTopics')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(problem.tags ?? []).map((tag) => (
                <Chip key={tag.id} label={tag.name} variant="outlined" size="small" />
              ))}
              {(problem.topics ?? []).map((topic) => (
                <Chip key={topic.id} label={topic.name} color="info" size="small" />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : null}

      {problem.hasSolution ? (
        <Accordion
          sx={{ mt: 2 }}
          expanded={solutionExpanded}
          onChange={(_, expanded) => setSolutionExpanded(expanded)}
        >
          <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}>
            <Typography fontWeight={700}>{t('problems.detail.solution')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isSolutionLoading ? (
              <LinearProgress />
            ) : solution ? (
              <Stack spacing={2}>
                <Typography dangerouslySetInnerHTML={{ __html: solution.solution }} />
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
