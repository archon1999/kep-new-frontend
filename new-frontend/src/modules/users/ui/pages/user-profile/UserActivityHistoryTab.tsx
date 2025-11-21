import { useOutletContext } from 'react-router';
import { useUserActivityHistory } from 'modules/home/application/queries';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';
import type { UserProfileOutletContext } from './UserProfilePage';

const UserActivityHistoryTab = () => {
  const { username } = useOutletContext<UserProfileOutletContext>();
  const { data: history, isLoading } = useUserActivityHistory(username, 10);

  return <HomeActivityHistory username={username} history={history} isLoading={isLoading} />;
};

export default UserActivityHistoryTab;
