export interface UserGeneralInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
}

export interface UserInfo {
  country?: string;
  region?: string;
  website?: string;
  email?: string;
  emailVisible?: boolean;
  dateJoined?: string;
  dateOfBirth?: string;
  bio?: string;
}

export interface UserSocial {
  codeforcesHandle?: string;
  codeforcesBadge?: string;
  telegram?: string;
}

export interface UserSkills {
  python?: number;
  webDevelopment?: number;
  webScraping?: number;
  algorithms?: number;
  dataScience?: number;
}

export interface UserTechnology {
  text: string;
  devIconClass?: string;
  badgeColor?: string;
}

export interface UserEducation {
  organization: string;
  degree: string;
  fromYear: number;
  toYear: number;
}

export interface UserWorkExperience {
  company: string;
  jobTitle: string;
  fromYear: number;
  toYear: number;
}

export interface TeamMember {
  username: string;
  avatar?: string;
  status: number;
}

export interface Team {
  id: number;
  createrUsername: string;
  createrAvatar?: string;
  name: string;
  members: TeamMember[];
  code: string;
}
