import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { UserRatings } from '../../domain/entities/user.entity';

interface UserRatingsOverviewProps {
  ratings?: UserRatings | null;
  isLoading?: boolean;
}

const RatingRow = ({ label, value }: { label: string; value?: number | string }) => (
  <Stack direction="column" spacing={0.25}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={700}>
      {value ?? '—'}
    </Typography>
  </Stack>
);

const UserRatingsOverview = ({ ratings, isLoading }: UserRatingsOverviewProps) => {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="column" spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          {t('userProfile.ratings.title')}
        </Typography>

        {isLoading ? (
          <Stack direction="column" spacing={1}>
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={28} />
          </Stack>
        ) : (
          <Stack direction="column" spacing={1.25}>
            <RatingRow label={t('userProfile.ratings.skills')} value={ratings?.skillsRating?.value} />
            <RatingRow label={t('userProfile.ratings.activity')} value={ratings?.activityRating?.value} />
            <RatingRow label={t('userProfile.ratings.contests')} value={ratings?.contestsRating?.value} />
            <RatingRow label={t('userProfile.ratings.challenges')} value={ratings?.challengesRating?.value} />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default UserRatingsOverview;
