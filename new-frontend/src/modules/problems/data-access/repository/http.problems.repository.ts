import { problemsApiClient, ProblemsListParams } from '../api/problems.client.ts';
import {
  mapAttemptPreview,
  mapDifficulties,
  mapProblemHighlight,
  mapProblemsPage,
  mapSummary,
} from '../mappers/problems.mapper.ts';
import { PageResult, ProblemsRepository } from '../../domain/ports/problems.repository.ts';
import { DifficultiesBreakdown, ProblemAttemptPreview, ProblemHighlight, ProblemsSummary } from '../../domain/entities/stats.entity.ts';
import { Problem } from '../../domain/entities/problem.entity.ts';

const fallbackProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 2,
    difficultyTitle: 'Basic',
    solvedCount: 4281,
    attemptsCount: 5120,
    tags: [{ id: 1, name: 'Arrays' }],
    topics: [{ id: 1, name: 'Algorithms' }],
    hasSolution: true,
    hasChecker: true,
    likesCount: 120,
    dislikesCount: 4,
  },
  {
    id: 2,
    title: 'Binary Search Tree',
    difficulty: 4,
    difficultyTitle: 'Medium',
    solvedCount: 1987,
    attemptsCount: 2750,
    tags: [{ id: 2, name: 'Trees' }],
    topics: [{ id: 2, name: 'Data Structures' }],
    hasSolution: true,
    hasChecker: true,
    likesCount: 86,
    dislikesCount: 8,
  },
  {
    id: 3,
    title: 'Graph Paths',
    difficulty: 6,
    difficultyTitle: 'Hard',
    solvedCount: 342,
    attemptsCount: 980,
    tags: [{ id: 3, name: 'Graphs' }],
    topics: [{ id: 3, name: 'Algorithms' }],
    hasSolution: false,
    hasChecker: true,
    likesCount: 42,
    dislikesCount: 12,
  },
];

const fallbackAttempts: ProblemAttemptPreview[] = [
  { id: 101, problemId: 1, problemTitle: 'Two Sum', verdict: 'Accepted', language: 'CPP', createdAt: new Date().toISOString() },
  {
    id: 102,
    problemId: 2,
    problemTitle: 'Binary Search Tree',
    verdict: 'Wrong answer',
    language: 'Python',
    createdAt: new Date().toISOString(),
  },
  {
    id: 103,
    problemId: 3,
    problemTitle: 'Graph Paths',
    verdict: 'Time limit exceeded',
    language: 'Java',
    createdAt: new Date().toISOString(),
  },
];

const fallbackHighlights: ProblemHighlight[] = fallbackProblems.map((problem) => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  difficultyTitle: problem.difficultyTitle,
  attemptsCount: problem.attemptsCount,
}));

const fallbackSummary: ProblemsSummary = {
  solved: 42,
  rating: 1280,
  attempts: 128,
  likesReceived: 24,
  userRank: 12,
  totalProblems: 500,
};

const fallbackDifficulties: DifficultiesBreakdown = {
  beginner: 12,
  basic: 10,
  normal: 8,
  medium: 6,
  advanced: 4,
  hard: 2,
  extremal: 0,
  allBeginner: 40,
  allBasic: 60,
  allNormal: 70,
  allMedium: 55,
  allAdvanced: 40,
  allHard: 20,
  allExtremal: 10,
  totalSolved: 42,
  totalProblems: 500,
};

export class HttpProblemsRepository implements ProblemsRepository {
  async listProblems(params?: ProblemsListParams): Promise<PageResult<Problem>> {
    try {
      const response = await problemsApiClient.list(params);
      return mapProblemsPage(response);
    } catch {
      return {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? fallbackProblems.length,
        count: fallbackProblems.length,
        total: fallbackProblems.length,
        pagesCount: 1,
        data: fallbackProblems,
      };
    }
  }

  async getSummary(username?: string | null): Promise<ProblemsSummary> {
    try {
      const response = await problemsApiClient.getSummary(username ?? undefined);
      return mapSummary(response);
    } catch {
      return fallbackSummary;
    }
  }

  async getDifficulties(username?: string | null): Promise<DifficultiesBreakdown> {
    try {
      const response = await problemsApiClient.getSummary(username ?? undefined);
      return mapDifficulties(response);
    } catch {
      return fallbackDifficulties;
    }
  }

  async getLastAttempts(params?: { page?: number; pageSize?: number }): Promise<ProblemAttemptPreview[]> {
    try {
      const response = await problemsApiClient.getLastAttempts(params);
      const data = response?.data ?? response?.results ?? response ?? [];
      return data.map(mapAttemptPreview);
    } catch {
      return fallbackAttempts;
    }
  }

  async getLastContestProblems(params?: { page?: number; pageSize?: number }): Promise<ProblemHighlight[]> {
    try {
      const response = await problemsApiClient.getLastContestProblems(params);
      const data = response?.data ?? response?.results ?? response ?? [];
      return data.map(mapProblemHighlight);
    } catch {
      return fallbackHighlights;
    }
  }

  async getMostViewed(params?: { page?: number; pageSize?: number }): Promise<ProblemHighlight[]> {
    try {
      const response = await problemsApiClient.getMostViewed(params);
      const data = response?.data ?? response?.results ?? response ?? [];
      return data.map(mapProblemHighlight);
    } catch {
      return fallbackHighlights;
    }
  }
}
