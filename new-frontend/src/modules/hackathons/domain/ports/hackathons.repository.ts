import { Hackathon } from '../entities/hackathon.entity';

export interface HackathonsRepository {
  list(): Promise<{ data: Hackathon[]; total: number }>;
  getById(id: string): Promise<Hackathon>;
}
