import useSWRMutation from 'swr/mutation';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';

const repository = new HttpKepcoinRepository();

export const usePurchaseStreakFreeze = () =>
  useSWRMutation('kepcoin/purchase-streak-freeze', async () => {
    await repository.purchaseStreakFreeze();
  });
