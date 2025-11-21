import { Test } from './test.entity';

export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  tests?: Test[];
}

export interface ChapterWithTests extends Chapter {
  tests: Test[];
}
