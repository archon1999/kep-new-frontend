export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  status: string;
}

export type UserStatus = 'online' | 'offline' | 'busy' | 'away';

export interface UserRating {
  title: string;
  value: number;
}

export interface UserStreak {
  current: number;
  max: number;
}

export interface UserListItem {
  id: number | string;
  username: string;
  fullName: string;
  avatar: string;
  email: string;
  country: string;
  countryName: string;
  age: number;
  status: UserStatus;
  skillsRating: UserRating;
  activityRating: UserRating;
  contestsRating: UserRating;
  challengesRating: UserRating;
  streak: UserStreak;
  kepcoin: number;
  lastSeen: string;
}
