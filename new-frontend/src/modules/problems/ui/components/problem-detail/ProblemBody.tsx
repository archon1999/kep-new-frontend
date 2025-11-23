import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import { CustomProblemBody } from './CustomProblemBody';
import { ProblemDetail } from '../../../domain/entities/problem.entity';

interface ProblemBodyProps {
  problem: ProblemDetail;
  currentUser: any;
}

let mathJaxLoader: Promise<any> | null = null;

export const ProblemBody = ({ problem, currentUser }: ProblemBodyProps) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ensureMathJax = () => {
      if (mathJaxLoader) {
        return mathJaxLoader;
      }

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
        if (mathJax.typesetPromise) {
          setTimeout(() => mathJax.typesetPromise([contentRef.current]), 50);
        }
      })
      .catch(() => undefined);
  }, [problem.body, problem.inputData, problem.outputData, problem.comment]);

  return (
    <Box ref={contentRef} className="problem-body">
      {problem.id !== 1637 ? (
        <Typography
          variant="body1"
          color="text.primary"
          dangerouslySetInnerHTML={{ __html: problem.body ?? '' }}
        />
      ) : null}

      <CustomProblemBody problem={problem} currentUser={currentUser} />

      {problem.inputData ? (
        <Stack direction="column" mt={2} spacing={1}>
          <Typography variant="h6">{t('problems.detail.inputData')}</Typography>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: problem.inputData }} />
        </Stack>
      ) : null}

      {problem.outputData ? (
        <Stack direction="column" mt={2} spacing={1}>
          <Typography variant="h6">{t('problems.detail.outputData')}</Typography>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: problem.outputData }} />
        </Stack>
      ) : null}

      {problem.sampleTests?.length ? (
        <Stack direction="column" mt={2} spacing={2}>
          <Typography variant="h6">{t('problems.detail.sampleTests')}</Typography>
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
  );
};

export default ProblemBody;
