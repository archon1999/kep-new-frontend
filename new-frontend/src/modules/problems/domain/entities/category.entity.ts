import { ProblemTag } from './problem.entity.ts';

export interface ProblemCategory {
  id: number;
  title: string;
  description?: string;
  code?: string;
  icon?: string;
  problemsCount?: number;
  tags: ProblemTag[];
}
