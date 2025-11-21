import { ApiTestsListResult } from 'shared/api/orval/generated/endpoints';
import { Chapter, Test, TestsListResponse } from '../../domain/entities/testing.entity';

const mapChapter = (chapter?: ApiTestsListResult['data'][number]['chapter']): Chapter => ({
  id: chapter?.id ?? 0,
  title: chapter?.title ?? '',
  icon: chapter?.icon ?? null,
  testsCount: chapter?.testsCount ?? 0,
});

const mapTest = (test: ApiTestsListResult['data'][number]): Test => ({
  id: test.id ?? 0,
  title: test.title,
  description: test.description,
  duration: test.duration,
  difficulty: Number(test.difficulty),
  difficultyTitle: test.difficultyTitle,
  questionsCount: test.questionsCount,
  userBestResult: test.userBestResult !== undefined && test.userBestResult !== null
    ? Number(test.userBestResult)
    : undefined,
  chapter: mapChapter(test.chapter),
});

export const mapApiTestsListToDomain = (response: ApiTestsListResult): TestsListResponse => ({
  data: response.data.map(mapTest),
  total: response.total,
  count: response.count,
  pagesCount: response.pagesCount,
});
