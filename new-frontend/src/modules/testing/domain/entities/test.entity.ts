import { Chapter } from './chapter.entity';

export interface TestTag {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  duration: string;
  chapter: Chapter;
  difficultyTitle: string;
  difficulty: number;
  tags: TestTag[];
  userBestResult?: number;
  questionsCount?: number;
  passesCount?: number;
  lastPassed?: string;
}

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}
