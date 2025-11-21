export interface ProblemTag {
  id: number;
  name: string;
  category?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle: string;
  solved: number;
  attemptsCount: number;
  likesCount: number;
  dislikesCount: number;
  tags: ProblemTag[];
  authorUsername?: string;
  status?: 'solved' | 'attempted' | 'new';
  hasSolution?: boolean;
  hasChecker?: boolean;
}
