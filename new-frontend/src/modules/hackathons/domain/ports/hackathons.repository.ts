import { ProjectAttemptsPage } from 'modules/projects/domain/entities/project.entity';
import { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding } from '../entities/hackathon.entity';

export interface HackathonsRepository {
  list(): Promise<Hackathon[]>;
  getById(id: number | string): Promise<Hackathon>;
  getProjects(id: number | string): Promise<HackathonProject[]>;
  getProject(id: number | string, symbol: string): Promise<HackathonProject>;
  register(id: number | string): Promise<void>;
  unregister(id: number | string): Promise<void>;
  getStandings(id: number | string): Promise<HackathonStanding[]>;
  getRegistrants(id: number | string): Promise<HackathonRegistrant[]>;
  getAttempts(id: number | string, params?: { page?: number; username?: string }): Promise<ProjectAttemptsPage>;
}
