import { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import DefaultLoader from 'shared/components/loading/DefaultLoader';
import { resources } from 'app/routes/resources';
import ChapterWithTestsCard from '../components/ChapterWithTestsCard';
import { useTestsList } from '../../application/queries';
import { ChapterWithTests } from '../../domain/entities/chapter.entity';

const TestsListPage = () => {
  const { t } = useTranslation();
  const params = useMemo(() => ({ page: 1, pageSize: 50 }), []);
  const { data, isLoading } = useTestsList(params);

  const chapters = useMemo<ChapterWithTests[]>(() => {
    if (!data) return [];

    const grouped = data.data.reduce<Record<number, ChapterWithTests>>((acc, test) => {
      const chapterId = test.chapter.id;
      if (!acc[chapterId]) {
        acc[chapterId] = { ...test.chapter, tests: [] };
      }
      acc[chapterId].tests.push(test);
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.id - b.id);
  }, [data]);

  return (
    <Stack direction="column" spacing={4} height={1}>
      <PageHeader
        title={t('testing.title')}
        breadcrumb={[
          { label: t('menu.practice'), url: resources.Tests },
          { label: t('testing.title'), active: true },
        ]}
      />

      <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" py={6}>
            <DefaultLoader />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {chapters.map((chapter) => (
              <Grid key={chapter.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <ChapterWithTestsCard chapter={chapter} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default TestsListPage;
