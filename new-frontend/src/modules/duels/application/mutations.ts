import useSWRMutation from 'swr/mutation';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { DuelCreatePayload } from '../domain/ports/duels.repository.ts';
import { duelsQueries } from './queries.ts';

const duelsRepository = new HttpDuelsRepository();

export const useUpdateReadyStatus = () =>
  useSWRMutation('duels-ready-status', (_, { arg }: { arg: boolean }) => duelsRepository.updateReadyStatus(arg));

export const useConfirmDuel = () => useSWRMutation('duel-confirm', (_, { arg }: { arg: number }) => duelsRepository.confirmDuel(arg));

export const useCreateDuel = () =>
  useSWRMutation('duel-create', (_, { arg }: { arg: DuelCreatePayload }) => duelsRepository.createDuel(arg));

export const duelsMutations = {
  duelsRepository,
  duelsQueries,
};
