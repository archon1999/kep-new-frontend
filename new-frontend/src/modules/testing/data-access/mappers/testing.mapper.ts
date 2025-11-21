import { Chapter } from '../../domain/entities/chapter.entity';
import { PageResult, Test, TestTag } from '../../domain/entities/test.entity';
import { ApiChapter, ApiPageResult, ApiTest, ApiTestTag } from '../api/testing.dto';

const mapApiTestTag = (tag: ApiTestTag): TestTag => ({
  id: tag.id,
  name: tag.name,
});

const mapApiChapter = (chapter: ApiChapter): Chapter => ({
  id: chapter.id,
  title: chapter.title,
  description: chapter.description,
  icon: chapter.icon,
});

export const mapApiTestToDomain = (test: ApiTest): Test => ({
  id: test.id,
  title: test.title,
  description: test.description,
  duration: test.duration,
  chapter: mapApiChapter(test.chapter),
  difficulty: test.difficulty,
  difficultyTitle: test.difficulty_title ?? test.difficultyTitle ?? '',
  tags: test.tags?.map(mapApiTestTag) ?? [],
  userBestResult: test.user_best_result ?? test.userBestResult,
  questionsCount:
    test.questions_count ?? test.questionsCount ?? (Array.isArray((test as any).questions) ? (test as any).questions.length : undefined),
  passesCount: test.passes_count ?? test.passesCount,
  lastPassed: test.last_passed ?? test.lastPassed,
});

export const mapApiPageResult = <T, K>(
  pageResult: ApiPageResult<T>,
  mapItem: (item: T) => K,
): PageResult<K> => ({
  page: pageResult.page,
  pageSize: pageResult.pageSize,
  count: pageResult.count,
  total: pageResult.total,
  pagesCount: pageResult.pagesCount,
  data: pageResult.data.map(mapItem),
});
