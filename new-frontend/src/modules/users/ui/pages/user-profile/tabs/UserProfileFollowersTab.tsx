import UserFollowersList from '../components/UserFollowersList';
import { useProfileContext } from '../UserProfilePage';

const UserProfileFollowersTab = () => {
  const { username } = useProfileContext();

  return <UserFollowersList username={username} />;
};

export default UserProfileFollowersTab;
