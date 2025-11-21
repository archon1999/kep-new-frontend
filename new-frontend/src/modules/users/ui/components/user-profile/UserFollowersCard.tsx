import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useUserFollowers } from '../../../application/queries';

type UserFollowersCardProps = {
  username: string;
};

const UserFollowersCard = ({ username }: UserFollowersCardProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserFollowers(username, { page: 1, pageSize: 5 });

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Skeleton variant="text" width="40%" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="70%" />
            </Stack>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return null;
  }

  const followers = data.data.slice(0, 5);
  const total = data.total ?? followers.length;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.followers.title')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {total}
          </Typography>
        </Stack>

        <List dense sx={{ mt: 1 }}>
          {followers.map((follower) => (
            <ListItem key={follower.username} disableGutters>
              <ListItemAvatar>
                <Avatar src={follower.avatar} alt={follower.username} />
              </ListItemAvatar>
              <ListItemText primary={follower.username} secondary={`${follower.firstName ?? ''} ${follower.lastName ?? ''}`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserFollowersCard;
