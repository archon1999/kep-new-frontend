import { TestDetail as ApiTestDetail, TestList } from 'shared/api/orval/generated/endpoints/index.schemas';
import { TestDetail, TestResultItem, TestSummary } from '../../domain/entities/test.entity.ts';

export const mapTestSummary = (test: TestList): TestSummary => ({
  id: test.id ?? 0,
  title: test.title,
  description: test.description,
  duration: test.duration,
  difficulty: Number(test.difficulty),
  difficultyTitle: test.difficultyTitle,
  questionsCount: test.questionsCount,
  userBestResult: test.userBestResult,
  chapter: {
    id: test.chapter.id ?? 0,
    title: test.chapter.title,
    icon: test.chapter.icon,
    testsCount: test.chapter.testsCount,
  },
});

export const mapTestDetail = (test: ApiTestDetail): TestDetail => ({
  ...mapTestSummary(test as unknown as TestList),
  lastPassed: test.lastPassed,
  passesCount: test.passesCount,
  tags: (test.tags ?? []).map((tag) => ({ id: tag.id ?? 0, name: tag.name ?? '' })),
});

export const mapTestResult = (item: any): TestResultItem => ({
  username: item.username ?? item.user ?? '',
  finished: item.finished ?? item.date ?? '',
  result: item.result ?? item.userBestResult ?? item.solved ?? '',
});
