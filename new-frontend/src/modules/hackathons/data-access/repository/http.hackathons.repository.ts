import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../../domain/entities/hackathon.entity';
import { HackathonsRepository, PageResult } from '../../domain/ports/hackathons.repository';
import { hackathonsApiClient } from '../api/hackathons.client';
import { mapHackathon, mapPageResult } from '../mappers/hackathon.mapper';

export class HttpHackathonsRepository implements HackathonsRepository {
  async list(params?: ApiHackathonsListParams): Promise<PageResult<Hackathon>> {
    const result = await hackathonsApiClient.list(params);
    return mapPageResult(result, mapHackathon);
  }
}
