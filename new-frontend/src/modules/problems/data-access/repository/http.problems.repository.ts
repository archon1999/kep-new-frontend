import { problemsApiClient } from '../api/problems.client.ts';
import {
  mapAttempt,
  mapCategory,
  mapContestPreview,
  mapPageResult,
  mapProblem,
  mapRatingSummary,
  mapTag,
} from '../mappers/problems.mapper.ts';
import {
  ContestPreview,
  PageResult,
  Problem,
  ProblemAttempt,
  ProblemCategory,
  ProblemsListParams,
  ProblemsRatingSummary,
  ProblemsRepository,
  ProblemTag,
} from '../../domain';

export class HttpProblemsRepository implements ProblemsRepository {
  async listProblems(params: ProblemsListParams): Promise<PageResult<Problem>> {
    const response = await problemsApiClient.listProblems(params);
    return mapPageResult<Problem>(response, mapProblem);
  }

  async listCategories(): Promise<ProblemCategory[]> {
    const response = await problemsApiClient.listCategories();
    return (response ?? []).map(mapCategory);
  }

  async listTags(): Promise<ProblemTag[]> {
    const response = await problemsApiClient.listTags();
    return (response ?? []).map(mapTag);
  }

  async listDifficulties(): Promise<Array<{ name: string; value: number }>> {
    const response = await problemsApiClient.listDifficulties();
    return (response ?? []).map((item: any) => ({
      name: item?.name ?? item?.title ?? '',
      value: Number(item?.value ?? item?.id ?? 0),
    }));
  }

  async listLanguages(): Promise<Array<{ value: string; label: string }>> {
    const response = await problemsApiClient.listLanguages();
    return (response ?? []).map((item: any) => ({
      value: item?.lang ?? item?.value ?? item,
      label: item?.langFull ?? item?.label ?? item?.name ?? item,
    }));
  }

  async getUserSummary(username?: string | null): Promise<ProblemsRatingSummary | null> {
    if (!username) return null;
    const response = await problemsApiClient.getUserRating(username);
    return mapRatingSummary(response);
  }

  async listUserAttempts(username?: string | null): Promise<ProblemAttempt[]> {
    if (!username) return [];
    const response = await problemsApiClient.listUserAttempts({ username, pageSize: 10 });
    const data = response?.data ?? response?.results ?? response;
    return (data ?? []).map(mapAttempt);
  }

  async getLastContestPreview(): Promise<ContestPreview | null> {
    const response = await problemsApiClient.getLastContest();
    return response ? mapContestPreview(response) : null;
  }

  async listMostViewed(): Promise<Problem[]> {
    const response = await problemsApiClient.listMostViewed();
    return (response ?? []).map(mapProblem);
  }
}
