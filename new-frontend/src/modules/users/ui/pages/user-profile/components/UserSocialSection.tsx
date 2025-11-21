import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Chip, Link, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useUserSocial } from 'modules/users/application/queries';

interface UserSocialSectionProps {
  username: string;
}

const UserSocialSection = ({ username }: UserSocialSectionProps) => {
  const { t } = useTranslation();
  const { data: social, isLoading } = useUserSocial(username);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={120} />;
  }

  if (!social?.telegram && !social?.codeforcesHandle) return null;

  return (
    <Paper background={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="h6" fontWeight={700}>
        {t('users.profile.socialLinks')}
      </Typography>

      <Stack direction="column" spacing={1}>
        {social.telegram ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={t('users.profile.telegram')} size="small" />
            <Link
              component={RouterLink}
              to={`https://t.me/${social.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="text.primary"
            >
              {social.telegram}
            </Link>
          </Stack>
        ) : null}

        {social.codeforcesHandle ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={t('users.profile.codeforces')} size="small" color="primary" variant="outlined" />
            <Link
              component={RouterLink}
              to={`https://codeforces.com/profile/${social.codeforcesHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="text.primary"
            >
              {social.codeforcesHandle}
            </Link>
            {social.codeforcesBadge ? (
              <img src={social.codeforcesBadge} alt="codeforces badge" height={20} />
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default UserSocialSection;
