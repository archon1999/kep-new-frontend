export interface ApiChapter {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface ApiTestTag {
  id: number;
  name: string;
}

export interface ApiTest {
  id: number;
  title: string;
  description: string;
  duration: string;
  chapter: ApiChapter;
  difficulty: number;
  difficulty_title: string;
  difficultyTitle?: string;
  tags: ApiTestTag[];
  user_best_result?: number;
  userBestResult?: number;
  questions_count?: number;
  questionsCount?: number;
  passes_count?: number;
  passesCount?: number;
  last_passed?: string;
  lastPassed?: string;
}

export interface ApiPageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}
