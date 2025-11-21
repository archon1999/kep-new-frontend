import UserRatingsSection from '../components/UserRatingsSection';
import { useProfileContext } from '../UserProfilePage';

const UserProfileRatingsTab = () => {
  const { username } = useProfileContext();

  return <UserRatingsSection username={username} />;
};

export default UserProfileRatingsTab;
