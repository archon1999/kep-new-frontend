import { Paper, Skeleton, Stack } from '@mui/material';
import { useUserRatings } from 'modules/users/application/queries';
import RanksSection from 'modules/home/ui/components/RanksSection';

interface UserRatingsSectionProps {
  username: string;
}

const UserRatingsSection = ({ username }: UserRatingsSectionProps) => {
  const { data: ratings, isLoading } = useUserRatings(username);

  return (
    <Paper background={1} sx={{ p: 3 }}>
      {isLoading ? <Skeleton variant="rectangular" height={220} /> : null}
      <Stack direction="column" spacing={2}>
        <RanksSection ratings={ratings as any} isLoading={isLoading} />
      </Stack>
    </Paper>
  );
};

export default UserRatingsSection;
