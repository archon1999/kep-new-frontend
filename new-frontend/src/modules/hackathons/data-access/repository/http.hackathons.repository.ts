import { hackathonsApiClient } from '../api/hackathons.client.ts';
import {
  mapHackathonDtoToDomain,
  mapHackathonProjectDtoToDomain,
  mapHackathonRegistrantToDomain,
  mapHackathonStandingToDomain,
  mapAttemptsPageFromHackathon,
} from '../mappers/hackathons.mapper.ts';
import { HackathonsRepository } from '../../domain/ports/hackathons.repository';
import { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding } from '../../domain/entities/hackathon.entity';
import { ProjectAttemptsPage } from 'modules/projects/domain/entities/project.entity';

export class HttpHackathonsRepository implements HackathonsRepository {
  async list(): Promise<Hackathon[]> {
    const response = await hackathonsApiClient.list();
    const items = Array.isArray(response?.data) ? response.data : response;
    return (items ?? []).map(mapHackathonDtoToDomain);
  }

  async getById(id: number | string): Promise<Hackathon> {
    const response = await hackathonsApiClient.getById(id);
    return mapHackathonDtoToDomain(response);
  }

  async getProjects(id: number | string): Promise<HackathonProject[]> {
    const response = await hackathonsApiClient.getProjects(id);
    const items = Array.isArray(response?.data) ? response.data : response;
    return (items ?? []).map(mapHackathonProjectDtoToDomain);
  }

  async getProject(id: number | string, symbol: string): Promise<HackathonProject> {
    const response = await hackathonsApiClient.getProject(id, symbol);
    return mapHackathonProjectDtoToDomain(response);
  }

  async register(id: number | string): Promise<void> {
    await hackathonsApiClient.register(id);
  }

  async unregister(id: number | string): Promise<void> {
    await hackathonsApiClient.unregister(id);
  }

  async getStandings(id: number | string): Promise<HackathonStanding[]> {
    const response = await hackathonsApiClient.getStandings(id);
    const items = Array.isArray(response?.data) ? response.data : response;
    return (items ?? []).map(mapHackathonStandingToDomain);
  }

  async getRegistrants(id: number | string): Promise<HackathonRegistrant[]> {
    const response = await hackathonsApiClient.getRegistrants(id);
    const items = Array.isArray(response?.data) ? response.data : response;
    return (items ?? []).map(mapHackathonRegistrantToDomain);
  }

  async getAttempts(id: number | string, params?: { page?: number; username?: string }): Promise<ProjectAttemptsPage> {
    const response = await hackathonsApiClient.getAttempts(id, {
      page: params?.page,
      username: params?.username,
    });
    return mapAttemptsPageFromHackathon(response);
  }
}
