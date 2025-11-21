import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUserRatings } from '../../../application/queries';
import { useUserProfileContext } from '../UserProfilePage';

const RatingCard = ({
  title,
  value,
  rank,
  percentile,
}: {
  title: string;
  value?: number | string;
  rank?: number;
  percentile?: number;
}) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Stack direction="column" spacing={0.5}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {value ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {rank !== undefined ? `#${rank}` : '—'}
      </Typography>
      {percentile !== undefined ? (
        <Typography variant="caption" color="text.secondary">
          {percentile}%
        </Typography>
      ) : null}
    </Stack>
  </Paper>
);

const UserRatingsTab = () => {
  const { username } = useUserProfileContext();
  const { t } = useTranslation();
  const { data: ratings } = useUserRatings(username);

  return (
    <Stack direction="column" spacing={3}>
      <Typography variant="h6" fontWeight={700}>
        {t('userProfile.tabs.ratings')}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RatingCard
            title={t('userProfile.ratings.skills')}
            value={ratings?.skillsRating?.value}
            rank={ratings?.skillsRating?.rank}
            percentile={ratings?.skillsRating?.percentile}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RatingCard
            title={t('userProfile.ratings.activity')}
            value={ratings?.activityRating?.value}
            rank={ratings?.activityRating?.rank}
            percentile={ratings?.activityRating?.percentile}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RatingCard
            title={t('userProfile.ratings.contests')}
            value={ratings?.contestsRating?.value}
            rank={ratings?.contestsRating?.rank}
            percentile={ratings?.contestsRating?.percentile}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RatingCard
            title={t('userProfile.ratings.challenges')}
            value={ratings?.challengesRating?.value}
            rank={ratings?.challengesRating?.rank}
            percentile={ratings?.challengesRating?.percentile}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserRatingsTab;
