import { Avatar, Stack, Typography } from '@mui/material';
import CountryFlag from './CountryFlag';
import type { UsersListItem } from '../../domain/entities/user.entity';

interface UserIdentityProps {
  user: UsersListItem;
}

const UserIdentity = ({ user }: UserIdentityProps) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar src={user.avatar} alt={user.username} sx={{ width: 48, height: 48 }}>
        {user.username?.[0]?.toUpperCase()}
      </Avatar>
      <Stack spacing={0.25} minWidth={0}>
        <Stack direction="row" alignItems="center" spacing={0.75} minWidth={0}>
          <Typography variant="subtitle2" noWrap>
            {user.username}
          </Typography>
          <CountryFlag code={user.country} />
        </Stack>
        {fullName ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {fullName}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default UserIdentity;
