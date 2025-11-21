import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress } from '@mui/material';
import { usersApiClient } from '../../../data-access/api/users.client';
import { useAuth } from 'app/providers/AuthProvider';

type ProfileFollowButtonProps = {
  username: string;
  isFollowing?: boolean;
};

const ProfileFollowButton = ({ username, isFollowing: isFollowingProp }: ProfileFollowButtonProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(Boolean(isFollowingProp));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(Boolean(isFollowingProp));
  }, [isFollowingProp]);

  const canFollow = useMemo(
    () => Boolean(username) && currentUser?.username !== username,
    [currentUser?.username, username],
  );

  const handleToggle = async () => {
    if (!canFollow || loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await usersApiClient.unfollow(username);
        setIsFollowing(false);
      } else {
        await usersApiClient.follow(username);
        setIsFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!canFollow) {
    return null;
  }

  return (
    <Button
      size="small"
      variant={isFollowing ? 'outlined' : 'contained'}
      color="primary"
      onClick={handleToggle}
      startIcon={loading ? <CircularProgress size={16} /> : undefined}
    >
      {isFollowing ? t('users.profile.actions.unfollow') : t('users.profile.actions.follow')}
    </Button>
  );
};

export default ProfileFollowButton;
