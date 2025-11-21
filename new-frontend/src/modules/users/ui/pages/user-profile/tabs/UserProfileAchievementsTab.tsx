import UserAchievementsSection from '../components/UserAchievementsSection';
import { useProfileContext } from '../UserProfilePage';

const UserProfileAchievementsTab = () => {
  const { username } = useProfileContext();

  return <UserAchievementsSection username={username} />;
};

export default UserProfileAchievementsTab;
