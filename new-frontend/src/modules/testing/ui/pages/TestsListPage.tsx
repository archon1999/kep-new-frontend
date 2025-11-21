import { useMemo } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTestsList } from '../../application/queries.ts';
import ChapterCard from '../components/ChapterCard.tsx';
import { Test } from '../../domain';

const TestsListPage = () => {
  const { t } = useTranslation();
  const { data: testsPage, isLoading } = useTestsList({ page: 1, pageSize: 50 });

  const chapters = useMemo(() => {
    const grouped = new Map<number, Test[]>();

    (testsPage?.data ?? []).forEach((test) => {
      if (!grouped.has(test.chapter.id)) {
        grouped.set(test.chapter.id, []);
      }

      grouped.get(test.chapter.id)?.push(test);
    });

    return Array.from(grouped.entries())
      .map(([id, tests]) => ({
        id,
        title: tests[0]?.chapter.title ?? '',
        tests,
      }))
      .sort((a, b) => a.id - b.id);
  }, [testsPage?.data]);

  const showEmptyState = !isLoading && (!testsPage?.data?.length || chapters.length === 0);

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {t('tests.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('tests.subtitle')}
          </Typography>
        </Box>

        {isLoading ? (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} variant="rounded" height={160} />
            ))}
          </Stack>
        ) : showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('tests.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('tests.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Stack direction="column" spacing={4}>
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapterTitle={chapter.title} tests={chapter.tests} />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default TestsListPage;
