import UserActivityHistorySection from '../components/UserActivityHistorySection';
import { useProfileContext } from '../UserProfilePage';

const UserProfileActivityTab = () => {
  const { username } = useProfileContext();

  return <UserActivityHistorySection username={username} />;
};

export default UserProfileActivityTab;
