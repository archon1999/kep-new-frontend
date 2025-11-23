import { useEffect, useMemo, useRef } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import type { ProblemDetail } from '../../../domain/entities/problem.entity';
import { CustomProblemBody } from './ProblemCustomBodies';

interface ProblemBodyProps {
  problem: ProblemDetail;
}

let mathJaxLoader: Promise<any> | null = null;

export const ProblemBody = ({ problem }: ProblemBodyProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (problem.id !== 2179) return;

    const handleResize = () => {
      if (window.innerWidth === 2025 || window.innerHeight === 2025) {
        alert('Keppy Birthday!');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [problem.id]);

  useEffect(() => {
    const ensureMathJax = () => {
      if (mathJaxLoader) return mathJaxLoader;

      mathJaxLoader = new Promise((resolve) => {
        if ((window as any).MathJax) {
          resolve((window as any).MathJax);
          return;
        }

        const existingScript = document.getElementById('mathjax-script');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve((window as any).MathJax));
          return;
        }

        (window as any).MathJax = {
          tex: {
            inlineMath: [
              ['$', '$'],
              ['\\(', '\\)'],
            ],
            displayMath: [
              ['$$', '$$'],
              ['\\[', '\\]'],
            ],
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          },
          startup: {
            typeset: false,
          },
        };

        const script = document.createElement('script');
        script.id = 'mathjax-script';
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        script.onload = () => resolve((window as any).MathJax);
        document.head.appendChild(script);
      });

      return mathJaxLoader;
    };

    ensureMathJax()
      ?.then((mathJax) => {
        if (mathJax?.startup?.promise && mathJax.typesetPromise) {
          mathJax.startup.promise.then(() => {
            setTimeout(() => mathJax.typesetPromise([contentRef.current]), 50);
          });
        }
      })
      .catch(() => undefined);
  }, [problem.body, problem.inputData, problem.outputData, problem.comment, problem.sampleTests]);

  const shouldRenderBody = problem.id !== 1637;
  const hasExtraSections = useMemo(
    () =>
      Boolean(
        problem.inputData ||
          problem.outputData ||
          (problem.sampleTests && problem.sampleTests.length > 0) ||
          problem.comment,
      ),
    [problem.comment, problem.inputData, problem.outputData, problem.sampleTests],
  );

  return (
    <Stack direction="column" spacing={2}>
      <Box
        ref={contentRef}
        className="problem-body"
        sx={{
          userSelect: 'none',
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            padding: 1,
            verticalAlign: 'top',
          },
          '& thead tr': {
            backgroundColor: 'action.hover',
          },
          '& pre': {
            margin: 0,
            background: 'transparent',
            fontFamily: 'monospace',
          },
        }}
      >
        {shouldRenderBody ? (
          <Typography
            variant="body1"
            color="text.primary"
            dangerouslySetInnerHTML={{ __html: problem.body ?? '' }}
          />
        ) : null}

        <CustomProblemBody problem={problem} />

        {hasExtraSections ? <Divider sx={{ my: 2 }} /> : null}

        {problem.inputData ? (
          <Stack direction="column" mt={2}>
            <Typography variant="h6">{t('problems.detail.inputData')}</Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: problem.inputData }} />
          </Stack>
        ) : null}

        {problem.outputData ? (
          <Stack direction="column" mt={2}>
            <Typography variant="h6">{t('problems.detail.outputData')}</Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: problem.outputData }} />
          </Stack>
        ) : null}

        {problem.sampleTests?.length ? (
          <Stack direction="column" mt={2} spacing={2}>
            <Typography variant="h6">{t('problems.detail.sampleTests')}</Typography>
            <Stack direction="column" spacing={2}>
              {problem.sampleTests.map((test, index) => (
                <Card key={`${test.input}-${index}`} variant="outlined">
                  <CardContent>
                    <Stack direction="column" spacing={2}>
                      <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontWeight={700}>{t('problems.detail.input')}</Typography>
                          <ClipboardButton text={test.input ?? ''} />
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
                          <ClipboardButton text={test.output ?? ''} />
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
          </Stack>
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
    </Stack>
  );
};
