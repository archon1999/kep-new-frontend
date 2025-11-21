import { useMemo } from 'react';
import { Box, CircularProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useTestsList } from '../../application/queries';
import { Chapter, Test } from '../../domain/entities/testing.entity';
import ChapterTestsCard from '../components/ChapterTestsCard';
import PageHeader from 'shared/components/sections/common/PageHeader';

const TestsListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useTestsList({ page: 1, pageSize: 50 });

  const chapters = useMemo(() => {
    if (!data?.data) return [] as Array<{ chapter: Chapter; tests: Test[] }>;

    const chaptersMap = new Map<number, { chapter: Chapter; tests: Test[] }>();

    data.data.forEach((test) => {
      const existing = chaptersMap.get(test.chapter.id);

      if (existing) {
        existing.tests.push(test);
        return;
      }

      chaptersMap.set(test.chapter.id, { chapter: test.chapter, tests: [test] });
    });

    return Array.from(chaptersMap.values()).sort((a, b) => a.chapter.id - b.chapter.id);
  }, [data]);

  return (
    <Stack spacing={4} height={1}>
      <PageHeader
        title={t('tests.title')}
        breadcrumb={[
          { label: t('menu.practice'), url: '/' },
          { label: t('tests.title'), active: true },
        ]}
      />

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 4, flex: 1 }}>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: 320 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {chapters.map(({ chapter, tests }) => (
              <Grid key={chapter.id} item xs={12} md={6} xl={4}>
                <ChapterTestsCard chapter={chapter} tests={tests} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default TestsListPage;
