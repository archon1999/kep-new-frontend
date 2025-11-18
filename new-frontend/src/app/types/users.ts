export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  status: string;
}

export type UserStatus = 'online' | 'offline' | 'busy';

export interface UserListRating {
  value: number;
  title?: string;
}

export interface UserStreak {
  current: number;
  max: number;
}

export interface UserListRow {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  email: string;
  country: string;
  age: number;
  status: UserStatus;
  skillsRating: UserListRating;
  activityRating: UserListRating;
  contestsRating: UserListRating;
  challengesRating: UserListRating;
  streak: UserStreak;
  kepcoin: number;
  lastSeen: string;
}
