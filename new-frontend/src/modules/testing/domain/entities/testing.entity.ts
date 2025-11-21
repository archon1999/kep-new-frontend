export type Chapter = {
  id: number;
  title: string;
  icon?: string | null;
  testsCount: number;
};

export type Test = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  difficulty: number;
  difficultyTitle: string;
  questionsCount: number;
  userBestResult?: number;
  chapter: Chapter;
};

export type TestsListRequest = {
  page?: number;
  pageSize?: number;
};

export type TestsListResponse = {
  data: Test[];
  total: number;
  count: number;
  pagesCount: number;
};
