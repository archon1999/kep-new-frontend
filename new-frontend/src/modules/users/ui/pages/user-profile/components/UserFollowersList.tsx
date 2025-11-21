import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Stack, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserFollowers } from 'modules/users/application/queries';
import type { UsersListItem } from 'modules/users/domain/entities/user.entity';
import { Link as RouterLink } from 'react-router-dom';

interface UserFollowersListProps {
  username: string;
}

const UserFollowersList = ({ username }: UserFollowersListProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserFollowers(username, { page, pageSize: 10 });

  const pages = useMemo(() => data?.pagesCount ?? 1, [data]);
  const followers = data?.data ?? [];

  return (
    <Paper background={1} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight={700}>
        {t('users.profile.followers')}
      </Typography>

      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          {t('common.loading')}
        </Typography>
      ) : (
        <List disablePadding>
          {followers.map((follower: UsersListItem) => (
            <ListItem
              key={follower.username}
              component={RouterLink}
              to={getResourceByUsername(resources.UserProfile, follower.username)}
              sx={{ px: 0, py: 1 }}
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
      )}

      {pages > 1 ? (
        <Stack direction="row" justifyContent="flex-end">
          <Pagination page={page} count={pages} onChange={(e, value) => setPage(value)} />
        </Stack>
      ) : null}
    </Paper>
  );
};

export default UserFollowersList;
