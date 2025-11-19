import type { KepcoinPageContent } from '../entities/kepcoin.entity';

export interface KepcoinRepository {
  getPageContent: () => KepcoinPageContent;
}
