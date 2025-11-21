import { problemsApiClient } from '../api/problems.client.ts';
import { LastContest, Problem, ProblemAttempt, ProblemTag, ProblemsPageResult, ProblemsRatingRow } from '../../domain/entities/problem.entity.ts';
import { ProblemsListParams, ProblemsRepository } from '../../domain/ports/problems.repository.ts';
import { mapAttempt, mapLastContest, mapPageResult, mapProblem, mapProblemTag, mapRatingRow } from '../mappers/problems.mapper.ts';

export class HttpProblemsRepository implements ProblemsRepository {
  async listProblems(params?: ProblemsListParams): Promise<ProblemsPageResult<Problem>> {
    const response = await problemsApiClient.listProblems(params);
    return mapPageResult<Problem>(response, mapProblem);
  }

  async listTags(): Promise<ProblemTag[]> {
    const response = await problemsApiClient.listTags();
    return (response ?? []).map(mapProblemTag);
  }

  async listDifficulties(): Promise<Array<{ value: number; name: string }>> {
    const response = await problemsApiClient.listDifficulties();
    return response ?? [];
  }

  async getUserRating(username: string): Promise<ProblemsRatingRow | null> {
    if (!username) return null;
    const response = await problemsApiClient.getUserRating(username);
    if (!response) return null;
    return mapRatingRow(response);
  }

  async listAttempts(params: { username: string; pageSize?: number }): Promise<ProblemAttempt[]> {
    const response = await problemsApiClient.listAttempts(params);
    const attempts = Array.isArray(response?.data ?? response?.results) ? response.data ?? response.results : response;
    return (attempts ?? []).map(mapAttempt);
  }

  async listMostViewed(): Promise<Problem[]> {
    const response = await problemsApiClient.listMostViewed();
    return (response ?? []).map(mapProblem);
  }

  async getLastContest(): Promise<LastContest | null> {
    const response = await problemsApiClient.getLastContest();
    return mapLastContest(response);
  }
}
