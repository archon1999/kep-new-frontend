import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import type { UserProfileOutletContext } from './UserProfilePage';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} textAlign="right">
      {value}
    </Typography>
  </Stack>
);

const UserAboutTab = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useOutletContext<UserProfileOutletContext>();

  return (
    <Stack direction="column" spacing={3}>
      <Paper background={1} sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.sections.overview')}
          </Typography>

          {isLoading ? (
            <Stack direction="column" spacing={1.5}>
              <Skeleton variant="text" width={320} />
              <Skeleton variant="rounded" height={16} />
              <Skeleton variant="rounded" height={16} width="60%" />
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {t('users.profile.about.description', {
                username: user?.username,
                name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username,
              })}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Paper background={1} sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('users.profile.sections.details')}
          </Typography>

          {isLoading ? (
            <Stack direction="column" spacing={1.25}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={18} />
              ))}
            </Stack>
          ) : (
            <Stack direction="column" spacing={1.25}>
              <InfoRow label={t('users.profile.labels.username')} value={user?.username ?? '—'} />
              <InfoRow
                label={t('users.profile.labels.name')}
                value={[user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'}
              />
              <InfoRow label={t('users.profile.labels.country')} value={user?.country ?? '—'} />
              <InfoRow label={t('users.profile.labels.lastSeen')} value={user?.lastSeen ?? '—'} />
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default UserAboutTab;
