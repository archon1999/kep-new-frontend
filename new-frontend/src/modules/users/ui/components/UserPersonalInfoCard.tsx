import { Avatar, Chip, Link, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUserInfo, useUserSocial } from '../../application/queries';
import type { UserDetails } from '../../domain/entities/user.entity';
import KepIcon from 'shared/components/base/KepIcon';

interface UserPersonalInfoCardProps {
  username: string;
  user?: UserDetails | null;
  isOwnProfile?: boolean;
}

const InfoRow = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="subtitle2" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Stack>
  ) : null;

const UserPersonalInfoCard = ({ username, user, isOwnProfile }: UserPersonalInfoCardProps) => {
  const { t } = useTranslation();
  const { data: info, isLoading } = useUserInfo(username);
  const { data: social, isLoading: socialLoading } = useUserSocial(username);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={user?.avatar} />
          <Stack direction="column" spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              {user?.firstName || user?.lastName ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}` : user?.username}
            </Typography>
            {user?.country ? <Chip size="small" label={user.country.toUpperCase()} /> : null}
          </Stack>
        </Stack>

        {isLoading ? (
          <Stack direction="column" spacing={1}>
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </Stack>
        ) : (
          <Stack direction="column" spacing={1.25}>
            <InfoRow label={t('userProfile.personal.fullName')} value={user ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : undefined} />
            <InfoRow label={t('userProfile.personal.email')} value={info?.emailVisible ? info.email : undefined} />
            <InfoRow label={t('userProfile.personal.location')} value={info?.region ? `${info.country ?? ''} • ${info.region}` : info?.country} />
            <InfoRow label={t('userProfile.personal.website')} value={info?.website} />
            <InfoRow label={t('userProfile.personal.joined')} value={info?.dateJoined} />
          </Stack>
        )}

        {socialLoading ? (
          <Skeleton height={20} />
        ) : (
          <Stack direction="column" spacing={1.25}>
            {social?.telegram ? (
              <Link href={`https://t.me/${social.telegram}`} target="_blank" rel="noopener noreferrer" underline="hover">
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name="send" />
                  <Typography variant="body2">{social.telegram}</Typography>
                </Stack>
              </Link>
            ) : null}

            {social?.codeforcesHandle ? (
              <Link
                href={`https://codeforces.com/profile/${social.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name="trophy" />
                  <Typography variant="body2">{social.codeforcesHandle}</Typography>
                </Stack>
              </Link>
            ) : null}
          </Stack>
        )}

        {isOwnProfile ? (
          <Typography variant="caption" color="text.secondary">
            {t('userProfile.personal.privacyNote')}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default UserPersonalInfoCard;
