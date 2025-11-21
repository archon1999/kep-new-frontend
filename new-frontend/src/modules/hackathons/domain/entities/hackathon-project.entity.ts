import { Project } from 'modules/projects/domain/entities/project.entity';

export interface HackathonProject {
  id: number;
  symbol: string;
  project: Project;
}
