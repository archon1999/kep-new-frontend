export interface GeneralInfo {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  coverPhoto?: string | null;
}

export interface ProfileInfo {
  bio?: string;
  dateOfBirth?: string;
  website?: string;
  country?: string;
  region?: string;
  email?: string;
  emailVisible?: boolean;
}

export interface SocialLinks {
  codeforcesHandle?: string;
  codeforcesBadge?: string;
  telegram?: string;
}

export interface Skills {
  python?: number;
  webDevelopment?: number;
  webScraping?: number;
  algorithms?: number;
  dataScience?: number;
}

export interface Technology {
  text: string;
  devIconClass?: string;
  badgeColor?: string;
}

export interface Education {
  organization?: string;
  degree?: string;
  fromYear?: number;
  toYear?: number;
}

export interface WorkExperience {
  company?: string;
  jobTitle?: string;
  fromYear?: number;
  toYear?: number;
}

export interface Team {
  id?: number;
  name: string;
  code: string;
  membersCount?: number;
  createdAt?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
