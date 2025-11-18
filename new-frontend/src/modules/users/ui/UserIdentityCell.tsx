import { Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StatusAvatar from 'shared/components/base/StatusAvatar';

import { UserListItem } from '../domain/entities/user.entity';

interface UserIdentityCellProps {
  user: UserListItem;
}

const getFlagFromCountry = (country?: string) => {
  if (!country) return null;

  const normalizedCode = country.toUpperCase();

  if (normalizedCode.length !== 2) return normalizedCode;

  return normalizedCode
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

const UserIdentityCell = ({ user }: UserIdentityCellProps) => {
  const flagEmoji = getFlagFromCountry(user.country);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ overflow: 'hidden' }}>
      <StatusAvatar
        status={user.isOnline ? 'online' : 'offline'}
        src={user.avatar}
        alt={user.username}
        sx={{ width: 48, height: 48 }}
      />

      <Stack spacing={0.5} minWidth={0}>
        <Stack direction="row" spacing={0.75} alignItems="center" minWidth={0}>
          <Typography
            component={RouterLink}
            to={`/users/user/${user.username}`}
            variant="subtitle2"
            noWrap
            color="text.primary"
            sx={{ fontWeight: 700, textDecoration: 'none' }}
          >
            {user.username}
          </Typography>

          {flagEmoji && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {flagEmoji}
            </Typography>
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" noWrap>
          {fullName || '—'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default UserIdentityCell;
