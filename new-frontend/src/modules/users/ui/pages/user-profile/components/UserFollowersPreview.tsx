import { useTranslation } from 'react-i18next';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper, Skeleton, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserFollowers } from 'modules/users/application/queries';
import type { UsersListItem } from 'modules/users/domain/entities/user.entity';
import { Link as RouterLink } from 'react-router-dom';

interface UserFollowersPreviewProps {
  username: string;
}

const UserFollowersPreview = ({ username }: UserFollowersPreviewProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserFollowers(username, { page: 1, pageSize: 5 });

  if (isLoading) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  const followers = data?.data ?? [];

  if (followers.length === 0) return null;

  return (
    <Paper background={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="h6" fontWeight={700}>
        {t('users.profile.followers')}
      </Typography>

      <List disablePadding>
        {followers.map((follower: UsersListItem) => (
          <ListItem
            key={follower.username}
            component={RouterLink}
            to={getResourceByUsername(resources.UserProfile, follower.username)}
            sx={{ px: 0, py: 0.5 }}
          >
            <ListItemAvatar>
              <Avatar src={follower.avatar} alt={follower.username} />
            </ListItemAvatar>
            <ListItemText
              primary={follower.username}
              secondary={[follower.firstName, follower.lastName].filter(Boolean).join(' ')}
            />
          </ListItem>
        ))}
      </List>

      {data && data.total > followers.length ? (
        <Typography variant="caption" color="text.secondary">
          {t('users.profile.moreFollowers', { count: data.total - followers.length })}
        </Typography>
      ) : null}
    </Paper>
  );
};

export default UserFollowersPreview;
