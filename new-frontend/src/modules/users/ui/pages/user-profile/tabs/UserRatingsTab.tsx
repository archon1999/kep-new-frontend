import { useTranslation } from 'react-i18next';
import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import { UserRatings } from 'modules/users/domain/entities/user.entity';
import UserRanksGrid from '../../../components/UserRanksGrid';

interface UserRatingsTabProps {
  ratings?: UserRatings;
  isLoading?: boolean;
}

const UserRatingsTab = ({ ratings, isLoading }: UserRatingsTabProps) => {
  const { t } = useTranslation();

  if (isLoading && !ratings) {
    return <Skeleton variant="rounded" height={240} />;
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('users.profile.tabs.ratings')}
        </Typography>

        <UserRanksGrid ratings={ratings} isLoading={Boolean(isLoading && !ratings)} />
      </Stack>
    </Paper>
  );
};

export default UserRatingsTab;
