export interface RatingValue {
  value?: number | string;
  title?: string;
}

export interface UsersListItem {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  country?: string;
  streak?: number;
  maxStreak?: number;
  kepcoin?: number;
  lastSeen?: string;
  skillsRating?: RatingValue;
  activityRating?: RatingValue;
  contestsRating?: RatingValue;
  challengesRating?: RatingValue;
}

export interface UserDetails {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  coverPhoto?: string;
  streak?: number;
  maxStreak?: number;
  kepcoin?: number;
  lastSeen?: string;
  isOnline?: boolean;
  country?: string;
}

export interface UserInfo {
  country?: string;
  region?: string;
  website?: string;
  email?: string;
  emailVisible?: boolean;
  dateJoined?: string | Date;
  dateOfBirth?: string | Date;
  bio?: string;
}

export interface UserSocial {
  codeforcesHandle?: string;
  codeforcesBadge?: string;
  telegram?: string;
}

export interface UserSkillSet {
  python?: number;
  webDevelopment?: number;
  webScraping?: number;
  algorithms?: number;
  dataScience?: number;
}

export interface UserTechnology {
  text?: string;
  devIconClass?: string;
  badgeColor?: string;
}

export interface UserEducation {
  organization?: string;
  degree?: string;
  fromYear?: number;
  toYear?: number;
}

export interface UserWorkExperience {
  company?: string;
  jobTitle?: string;
  fromYear?: number;
  toYear?: number;
}

export interface UserAchievement {
  id?: number;
  type?: number;
  title?: string;
  description?: string;
  totalProgress?: number;
  userResult?: {
    progress?: number;
    done?: boolean;
  };
}

export interface UserRatingInfo {
  value?: number | string;
  rank?: number;
  percentile?: number;
  title?: string;
}

export interface UserRatings {
  skillsRating?: UserRatingInfo;
  activityRating?: UserRatingInfo;
  contestsRating?: UserRatingInfo;
  challengesRating?: UserRatingInfo;
}

export interface UsersListResponse {
  page: number;
  pageSize: number;
  pagesCount: number;
  total: number;
  count: number;
  data: UsersListItem[];
}

export interface UsersListRequest {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  country?: string;
  ageFrom?: number;
  ageTo?: number;
}

export interface UsersChartStatistics {
  total: number;
  series: number[];
}
