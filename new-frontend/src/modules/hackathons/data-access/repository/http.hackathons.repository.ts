import { hackathonsApiClient } from '../api/hackathons.client';
import { mapHackathonToDomain } from '../mappers/hackathon.mapper';
import { HackathonsRepository } from '../../domain/ports/hackathons.repository';
import { Hackathon } from '../../domain/entities/hackathon.entity';

export class HttpHackathonsRepository implements HackathonsRepository {
  async list(): Promise<{ data: Hackathon[]; total: number }> {
    const response = await hackathonsApiClient.list();
    return {
      data: response.data.map(mapHackathonToDomain),
      total: response.total,
    };
  }

  async getById(id: string): Promise<Hackathon> {
    const hackathon = await hackathonsApiClient.getById(id);
    return mapHackathonToDomain(hackathon);
  }
}
