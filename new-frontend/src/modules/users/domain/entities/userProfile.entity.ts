import { UserDetails, UserRatings } from './user.entity';
import { HomeUserActivityHistory } from 'modules/home/domain/entities/home.entity';

export interface UserSkills {
  algorithms?: number;
  python?: number;
  webDevelopment?: number;
  webScraping?: number;
  dataScience?: number;
}

export interface UserTechnology {
  text: string;
  devIconClass?: string;
  badgeColor?: string;
}

export interface UserTimelineEntry {
  organization: string;
  degree?: string;
  fromYear?: number;
  toYear?: number;
}

export interface UserBioInfo {
  bio?: string;
  country?: string;
  region?: string;
  website?: string;
  email?: string;
  dateJoined?: string;
  dateOfBirth?: string;
}

export interface UserSocialLinks {
  codeforcesHandle?: string;
  codeforcesBadge?: string;
  telegram?: string;
}

export interface UserAboutData {
  info?: UserBioInfo;
  skills?: UserSkills;
  technologies?: UserTechnology[];
  educations?: UserTimelineEntry[];
  workExperiences?: UserTimelineEntry[];
  social?: UserSocialLinks;
}

export interface UserAchievementResult {
  progress: number;
  done: boolean;
}

export interface UserAchievementItem {
  id?: number;
  type?: number;
  title?: string;
  description?: string;
  totalProgress?: number;
  userResult?: UserAchievementResult;
}

export interface UserAchievements {
  data: UserAchievementItem[];
}

export interface UserProfileData {
  user?: UserDetails;
  ratings?: UserRatings;
  activityHistory?: HomeUserActivityHistory | null;
}
