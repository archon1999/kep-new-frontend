import useSWRMutation from 'swr/mutation';
import { HttpHackathonsRepository } from '../data-access/repository/http.hackathons.repository.ts';

const hackathonsRepository = new HttpHackathonsRepository();

export const useHackathonRegistration = (id?: string) =>
  useSWRMutation(id ? ['hackathon-registration', id] : null, async (_key, { arg }: { arg: { action: 'register' | 'unregister' } }) => {
    if (!id) return;
    if (arg.action === 'register') {
      await hackathonsRepository.register(id);
    } else {
      await hackathonsRepository.unregister(id);
    }
  });
