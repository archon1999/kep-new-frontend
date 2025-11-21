import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { UserRatingInfo, UserRatings } from 'modules/users/domain/entities/user.entity';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

interface UserRanksGridProps {
  ratings?: UserRatings;
  isLoading?: boolean;
}

const ratingConfig = [
  { key: 'skillsRating', labelKey: 'users.columns.skills' },
  { key: 'activityRating', labelKey: 'users.columns.activity' },
  { key: 'contestsRating', labelKey: 'users.columns.contests' },
  { key: 'challengesRating', labelKey: 'users.columns.challenges' },
] as const;

const UserRanksGrid = ({ ratings, isLoading }: UserRanksGridProps) => {
  const { t } = useTranslation();

  const ratingStats = useMemo(
    () =>
      ratingConfig
        .map(({ key, labelKey }) => {
          const stat = ratings?.[key] as UserRatingInfo | undefined;
          return {
            key,
            label: t(labelKey),
            stat,
          };
        })
        .filter((item) => Boolean(item.stat)),
    [ratings, t],
  );

  return (
    <Grid container spacing={1.5} alignItems="stretch">
      {ratingStats.length === 0 && isLoading &&
        ratingConfig.map(({ key }) => (
          <Grid item xs={6} sm={3} key={key}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Grid>
        ))}

      {ratingStats.map(({ key, label, stat }) => (
        <Grid key={key} item xs={6} sm={3}>
          <Stack direction="column" spacing={0.5} height="100%">
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Stack spacing={0.5}>
              {stat?.title && (
                <>
                  {key === 'contestsRating' ? (
                    <ContestsRatingChip title={stat.title} imgSize={20} />
                  ) : key === 'challengesRating' ? (
                    <ChallengesRatingChip title={stat.title} />
                  ) : (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {stat.title}
                    </Typography>
                  )}
                </>
              )}

              <Typography variant="subtitle2" fontWeight={700}>
                {stat?.value ?? t('users.emptyValue')}
              </Typography>
            </Stack>
            {typeof stat?.rank === 'number' && (
              <Typography variant="caption" color="text.secondary">
                #{stat.rank}
              </Typography>
            )}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserRanksGrid;
