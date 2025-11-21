import { LastContest, Problem, ProblemAttempt, ProblemTag, ProblemsPageResult, ProblemsRatingRow } from '../entities/problem.entity.ts';

export interface ProblemsListParams {
  search?: string;
  tags?: number[];
  difficulty?: number;
  status?: number;
  favorites?: boolean;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export interface ProblemsRepository {
  listProblems(params?: ProblemsListParams): Promise<ProblemsPageResult<Problem>>;
  listTags(): Promise<ProblemTag[]>;
  listDifficulties(): Promise<Array<{ value: number; name: string }>>;
  getUserRating(username: string): Promise<ProblemsRatingRow | null>;
  listAttempts(params: { username: string; pageSize?: number }): Promise<ProblemAttempt[]>;
  listMostViewed(): Promise<Problem[]>;
  getLastContest(): Promise<LastContest | null>;
}
