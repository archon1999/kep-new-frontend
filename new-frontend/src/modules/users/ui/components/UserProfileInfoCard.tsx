import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemText, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { UserDetails } from '../../domain/entities/user.entity';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';

interface UserProfileInfoCardProps {
  user?: UserDetails;
  isLoading?: boolean;
}

const UserProfileInfoCard = ({ user, isLoading }: UserProfileInfoCardProps) => {
  const { t } = useTranslation();

  const fullName = useMemo(() => {
    const joined = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    return joined || '—';
  }, [user?.firstName, user?.lastName]);

  const lastSeen = useMemo(() => {
    if (!user?.lastSeen) return '—';

    return dayjs(user.lastSeen).format('MMM DD, YYYY HH:mm');
  }, [user?.lastSeen]);

  return (
    <Paper background={1} sx={{ p: 3 }}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('users.profile.about')}
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }}
              primary={t('users.profile.fullName')}
              secondary={isLoading ? <Skeleton width={160} /> : fullName}
            />
          </ListItem>

          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }}
              primary={t('users.columns.lastSeen')}
              secondary={isLoading ? <Skeleton width={180} /> : lastSeen}
            />
          </ListItem>

          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }}
              primary={t('users.profile.country')}
              secondary={
                isLoading ? (
                  <Skeleton width={120} />
                ) : user?.country ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CountryFlagIcon code={user.country as string} size={20} />
                    <Typography variant="subtitle2" fontWeight={700}>
                      {user.country}
                    </Typography>
                  </Stack>
                ) : (
                  '—'
                )
              }
            />
          </ListItem>
        </List>
      </Stack>
    </Paper>
  );
};

export default UserProfileInfoCard;
