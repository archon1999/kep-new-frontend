import { useMemo } from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useUserRatings } from '../hooks';

const rankTemplates = [
  {
    key: 'skillsRating',
    label: 'Skills rating',
    icon: 'solar:ranking-star-duotone',
  },
  {
    key: 'activityRating',
    label: 'Activity rating',
    icon: 'solar:widget-5-duotone',
  },
  {
    key: 'contestsRating',
    label: 'Contests',
    icon: 'solar:cup-star-duotone',
  },
  {
    key: 'challengesRating',
    label: 'Challenges',
    icon: 'solar:target-duotone',
  },
];

type RatingDetails = {
  value?: number | string;
  rank?: number;
  percentile?: number;
};

const RanksSection = () => {
  const { sessionUser } = useAuth();
  const { data, isLoading } = useUserRatings(sessionUser?.username);

  const ranks = useMemo(() => {
    const ratings = (data as unknown as Record<string, RatingDetails>) || {};

    return rankTemplates.map((template) => {
      const rating = ratings[template.key] || {};

      return {
        ...template,
        value: rating.value ?? rating,
        rank: rating.rank,
        percentile: rating.percentile,
      };
    });
  }, [data]);

  return (
    <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
      {ranks.map((rank) => (
        <Grid key={rank.key} xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.dark}0a, ${theme.palette.primary.main}12)`,
              }}
            />
            <CardContent
              sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <IconifyIcon icon={rank.icon} width={26} height={26} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {rank.label}
                  </Typography>
                </Stack>
                {rank.percentile ? (
                  <Tooltip title={`Top ${rank.percentile}%`}>
                    <Typography variant="caption" color="text.secondary">
                      {rank.percentile}%
                    </Typography>
                  </Tooltip>
                ) : null}
              </Stack>
              <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
                {isLoading ? (
                  <Skeleton variant="text" width={96} height={38} />
                ) : (
                  <Typography variant="h4" fontWeight={700} color="text.primary">
                    {rank.value ?? '—'}
                  </Typography>
                )}
                {isLoading ? (
                  <Skeleton variant="rectangular" width={64} height={18} />
                ) : (
                  <Typography variant="subtitle2" color="text.secondary">
                    {rank.rank ? `#${rank.rank}` : '—'}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RanksSection;
