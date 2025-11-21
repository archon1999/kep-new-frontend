import { TestDetail, TestResultItem, TestSummary } from '../entities/test.entity.ts';

export interface TestsRepository {
  list(): Promise<TestSummary[]>;
  getById(id: string): Promise<TestDetail>;
  getBestResults(id: string): Promise<TestResultItem[]>;
  getLastResults(id: string): Promise<TestResultItem[]>;
  start(id: string): Promise<{ testPassId?: string | number; [key: string]: any }>;
}
