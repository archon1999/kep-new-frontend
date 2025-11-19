import { useMemo } from 'react';
import { StaticKepcoinRepository } from '../data-access/repository/static.kepcoin.repository';
import type { KepcoinPageContent } from '../domain/entities/kepcoin.entity';

const repository = new StaticKepcoinRepository();

export const useKepcoinContent = (): KepcoinPageContent => {
  return useMemo(() => repository.getPageContent(), []);
};
