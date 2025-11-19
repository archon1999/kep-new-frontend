import type {
  HomeListParams,
  HomeNewsList,
  HomeNextBirthdays,
  HomeOnlineUsers,
  HomePostsList,
  HomeTopUsers,
  HomeUserRatings,
  HomeUsersChart,
} from '../entities/home.entity';

export interface HomeRepository {
  getNews: (params?: HomeListParams) => Promise<HomeNewsList>;
  getPosts: (params?: HomeListParams) => Promise<HomePostsList>;
  getTopUsers: (params?: HomeListParams) => Promise<HomeTopUsers>;
  getNextBirthdays: (params?: HomeListParams) => Promise<HomeNextBirthdays>;
  getOnlineUsers: (params?: HomeListParams) => Promise<HomeOnlineUsers>;
  getUsersChart: () => Promise<HomeUsersChart>;
  getUserRatings: (username: string) => Promise<HomeUserRatings>;
}
