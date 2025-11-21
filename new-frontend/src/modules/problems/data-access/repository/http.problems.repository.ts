import { getCategoryIcon } from 'modules/problems/ui/utils/category-icons.ts';
import { ProblemsFilter } from '../../domain/entities/problems-filter.entity.ts';
import { Problem } from '../../domain/entities/problem.entity.ts';
import { ProblemsRatingSummary } from '../../domain/entities/problems-rating.entity.ts';
import {
  PageResult,
  ProblemCategory,
  ProblemDifficultyOption,
  ProblemLanguage,
  ProblemListItem,
  ProblemsRepository,
} from '../../domain/ports/problems.repository.ts';
import { problemsApiClient } from '../api/problems.client.ts';
import {
  mapCategory,
  mapDifficultyOption,
  mapLanguage,
  mapPageResult,
  mapProblem,
  mapProblemListItem,
  mapProblemsRatingSummary,
} from '../mappers/problem.mapper.ts';

const mapFilterToParams = (filter?: ProblemsFilter) => {
  if (!filter) return {};

  const params: Record<string, unknown> = {
    search: filter.search,
    ordering: filter.ordering,
    lang: filter.lang,
    category: filter.category ?? undefined,
    tags: filter.tags?.length ? filter.tags.join(',') : undefined,
    difficulty: filter.difficulty ?? undefined,
    favorites: filter.favorites ? true : undefined,
    page: filter.page,
    page_size: filter.pageSize,
  };

  if (filter.status === 1) {
    params.has_solved = 1;
  } else if (filter.status === 2) {
    params.has_solved = 0;
    params.has_attempted = 1;
  } else if (filter.status === 3) {
    params.has_solved = 0;
    params.has_attempted = 0;
  }

  return params;
};

export class HttpProblemsRepository implements ProblemsRepository {
  async listProblems(filter?: ProblemsFilter): Promise<PageResult<Problem>> {
    const response = await problemsApiClient.listProblems(mapFilterToParams(filter));
    return mapPageResult<Problem>(response, mapProblem);
  }

  async listCategories(): Promise<ProblemCategory[]> {
    const response = await problemsApiClient.listCategories();
    return (response ?? []).map(mapCategory).map((category) => ({
      ...category,
      icon: getCategoryIcon(category.id),
    }));
  }

  async listDifficulties(): Promise<ProblemDifficultyOption[]> {
    const response = await problemsApiClient.listDifficulties();
    return (response ?? []).map(mapDifficultyOption);
  }

  async listLanguages(): Promise<ProblemLanguage[]> {
    const response = await problemsApiClient.listLanguages();
    return (response ?? []).map(mapLanguage);
  }

  async getUserRatingSummary(username: string): Promise<ProblemsRatingSummary> {
    const response = await problemsApiClient.getUserRating(username);
    return mapProblemsRatingSummary(response);
  }

  async listMostViewed(): Promise<ProblemListItem[]> {
    const response = await problemsApiClient.listMostViewed();
    return (response ?? []).map(mapProblemListItem);
  }

  async getLastContestProblems(): Promise<{ id: number; title: string; problems: ProblemListItem[] } | null> {
    const response = await problemsApiClient.getLastContest();
    if (!response) return null;

    return {
      id: Number(response?.id ?? 0),
      title: response?.title ?? '',
      problems: (response?.problems ?? []).map(mapProblemListItem),
    };
  }

  async listLastAttempts(username: string): Promise<ProblemListItem[]> {
    const response = await problemsApiClient.listUserAttempts(username, 10);
    return (response?.data ?? response ?? []).map((attempt: any) =>
      mapProblemListItem({
        id: attempt?.problemId ?? attempt?.problem_id ?? attempt?.problem?.id,
        title: attempt?.problemTitle ?? attempt?.problem_title ?? attempt?.problem?.title,
      }),
    );
  }
}
