import type { KepcoinPageContent } from '../../domain/entities/kepcoin.entity';
import type { KepcoinRepository } from '../../domain/ports/kepcoin.repository';

export class StaticKepcoinRepository implements KepcoinRepository {
  getPageContent(): KepcoinPageContent {
    return {
      title: 'Kepcoin',
      description: "Bu sahifa tez orada to'ldiriladi.",
    };
  }
}
