export interface TestChapter {
  id: number;
  title: string;
  icon?: string | null;
  testsCount: number;
}

export interface TestSummary {
  id: number;
  title: string;
  description?: string;
  duration: string;
  difficulty: number;
  difficultyTitle: string;
  questionsCount: number;
  userBestResult?: string;
  chapter: TestChapter;
}

export interface TestTag {
  id: number;
  name: string;
}

export interface TestDetail extends TestSummary {
  lastPassed?: string;
  passesCount: number;
  tags?: TestTag[];
}

export interface TestResultItem {
  username?: string;
  finished?: string;
  result?: string | number;
}
