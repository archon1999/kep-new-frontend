import { Box, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTestsList } from '../../application/queries';
import { TestSummary } from '../../domain/entities/test.entity.ts';
import TestCard from '../components/TestCard.tsx';

const TestsListPage = () => {
  const { t } = useTranslation();
  const { data: tests, isLoading } = useTestsList();

  const chapters = useMemo(() => {
    if (!tests) return [];
    const grouped = tests.reduce<Record<string, TestSummary[]>>((acc, test) => {
      const chapterKey = `${test.chapter.id}-${test.chapter.title}`;
      acc[chapterKey] = acc[chapterKey] ? [...acc[chapterKey], test] : [test];
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, chapterTests]) => ({
      key,
      chapter: chapterTests[0].chapter,
      tests: chapterTests,
    }));
  }, [tests]);

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('testsPage.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('testsPage.subtitle')}
          </Typography>
        </Stack>

        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
                <Skeleton variant="rounded" height={240} />
              </Grid>
            ))}
          </Grid>
        ) : (
          chapters.map((group) => (
            <Stack key={group.key} spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {group.chapter.icon && (
                  <Box component="img" src={group.chapter.icon} alt={group.chapter.title} sx={{ width: 32, height: 32 }} />
                )}
                <Typography variant="h6" fontWeight={800}>
                  {group.chapter.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('testsPage.testsCount', { count: group.tests.length })}
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {group.tests.map((test) => (
                  <Grid key={test.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <TestCard test={test} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default TestsListPage;
