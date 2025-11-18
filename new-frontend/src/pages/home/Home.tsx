import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import {
  useHomeArenas,
  useHomeContests,
  useHomeNews,
  useUserRatings,
} from 'pages/home/hooks';
import { Arena, BlogList, Contest } from 'shared/api/orval/generated/endpoints';
import KepIcon from 'shared/components/base/KepIcon';
import Swiper from 'shared/components/base/Swiper';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface RatingMetric {
  value?: string | number;
  rank?: number;
  percentile?: number;
}

interface RatingsResponse {
  skillsRating?: RatingMetric;
  activityRating?: RatingMetric;
  contestsRating?: RatingMetric;
  challengesRating?: RatingMetric;
}

const formatRating = (metric?: RatingMetric | null): RatingMetric => {
  if (!metric || typeof metric === 'string' || typeof metric === 'number') {
    return { value: metric as number | string | undefined };
  }

  const metricRecord = metric as Record<string, unknown>;

  return {
    value:
      typeof metricRecord.value === 'number' || typeof metricRecord.value === 'string'
        ? metricRecord.value
        : typeof metricRecord.rating === 'number' || typeof metricRecord.rating === 'string'
          ? metricRecord.rating
          : undefined,
    rank: typeof metricRecord.rank === 'number' ? metricRecord.rank : undefined,
    percentile: typeof metricRecord.percentile === 'number' ? metricRecord.percentile : undefined,
  };
};

const RankRow = ({
  icon,
  title,
  metric,
  loading,
}: {
  icon: string;
  title: string;
  metric: RatingMetric;
  loading?: boolean;
}) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    sx={{
      p: 2.5,
      bgcolor: 'background.elevation1',
      borderRadius: 3,
      border: 1,
      borderColor: 'divider',
    }}
  >
    <Avatar
      sx={{
        bgcolor: 'primary.lighter',
        color: 'primary.main',
        width: 44,
        height: 44,
      }}
    >
      <KepIcon name={icon} color="primary" type="duotone" />
    </Avatar>

    <Stack spacing={0.5} flexGrow={1} minWidth={0}>
      <Typography variant="subtitle1" fontWeight={600} noWrap>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {metric.percentile !== undefined
          ? `${metric.percentile}%`
          : loading
            ? '—'
            : undefined}
      </Typography>
    </Stack>

    <Stack spacing={0.25} alignItems="flex-end" minWidth={56}>
      {loading ? (
        <Skeleton variant="rounded" width={52} height={16} />
      ) : (
        <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
          {metric.value ?? '—'}
        </Typography>
      )}
      {loading ? (
        <Skeleton variant="text" width={42} />
      ) : (
        <Typography variant="caption" color="text.secondary">
          {metric.rank !== undefined ? `#${metric.rank}` : '—'}
        </Typography>
      )}
    </Stack>
  </Stack>
);

const ContestCard = ({ contest, loading }: { contest?: Contest; loading?: boolean }) => {
  const { t } = useTranslation();

  const status = contest?.status?.toLowerCase();
  const isFinished = status === 'finished';

  return (
    <Card
      sx={{
        height: 1,
        bgcolor: 'background.elevation1',
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('homeContest')}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {loading ? <Skeleton width={180} /> : contest?.title ?? t('homeNoContest')}
            </Typography>
          </Stack>
          {contest?.logo && <Avatar src={contest.logo ?? undefined} variant="rounded" sx={{ width: 48, height: 48 }} />}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          <IconifyIcon icon="solar:calendar-minimalistic-line-duotone" />
          {loading ? (
            <Skeleton width={120} />
          ) : (
            <Typography variant="body2">
              {contest?.startTime
                ? `${t('homeStarts')} · ${dayjs(contest.startTime).format('MMM D, HH:mm')}`
                : t('homeNoTiming')}
            </Typography>
          )}
        </Stack>

        {contest?.finishTime && !loading && (
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <IconifyIcon icon="solar:clock-circle-linear" />
            <Typography variant="body2">
              {`${t('homeEnds')} · ${dayjs(contest.finishTime).format('MMM D, HH:mm')}`}
            </Typography>
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!contest || loading}
          endIcon={<IconifyIcon icon="solar:arrow-right-linear" />}
        >
          {isFinished ? t('homeStandings') : t('homeParticipate')}
        </Button>
      </CardActions>
    </Card>
  );
};

const ArenaCard = ({ arena, loading }: { arena?: Arena; loading?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        height: 1,
        background: 'linear-gradient(135deg, #f8b600e3, #fde29c)',
        borderRadius: 3,
        border: 'none',
        color: 'text.primary',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('homeArena')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {loading ? <Skeleton width={160} /> : arena?.title ?? t('homeNoArena')}
            </Typography>
          </Stack>
          <KepIcon name="arena" type="duotone" color="primary" />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          <IconifyIcon icon="solar:calendar-minimalistic-line-duotone" />
          {loading ? (
            <Skeleton width={120} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {arena?.startTime
                ? `${t('homeStarts')} · ${dayjs(arena.startTime).format('MMM D, HH:mm')}`
                : t('homeNoTiming')}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          <IconifyIcon icon="solar:clock-circle-linear" />
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {arena?.timeSeconds ? `${arena.timeSeconds} s` : '—'}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'space-between' }}>
        <Chip
          size="small"
          color="warning"
          icon={<IconifyIcon icon="solar:timer-2-outline" fontSize={16} />}
          label={loading ? '—' : `${arena?.questionsCount ?? 0} Q`}
          sx={{ fontWeight: 600 }}
        />
        {arena?.isRegistrated ? (
          <Chip color="success" label={t('homeRegistrated')} size="small" />
        ) : (
          <Button variant="contained" color="primary" size="small" disabled={!arena || loading}>
            {t('homeRegistration')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const NewsCard = ({ blog }: { blog: BlogList }) => {
  const imageUrl = blog.image || '';

  const tags = useMemo(() => {
    if (Array.isArray(blog.tags)) {
      return blog.tags as string[];
    }

    if (typeof blog.tags === 'string') {
      return blog.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  }, [blog.tags]);

  return (
    <Card
      sx={{
        position: 'relative',
        color: 'common.white',
        height: 320,
        overflow: 'hidden',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(4, 7, 29, 0.55) 0%, rgba(4, 7, 29, 0.85) 70%), url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(0.1)',
        }}
      />
      <Stack sx={{ position: 'relative', p: 3, height: 1, justifyContent: 'space-between', gap: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
            {blog.title}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} color="secondary" variant="soft" />
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <IconifyIcon icon="solar:chat-round-dots-outline" fontSize={18} />
            <Typography variant="body2">{blog.commentsCount ?? 0}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <IconifyIcon icon="solar:heart-linear" fontSize={18} />
            <Typography variant="body2">{blog.likesCount ?? 0}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <IconifyIcon icon="solar:eye-outline" fontSize={18} />
            <Typography variant="body2">{blog.views ?? 0}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { up } = useBreakpoints();
  const upLg = up('lg');

  const { data: ratingsData, isLoading: ratingsLoading } = useUserRatings(currentUser?.username);
  const { data: contestData, isLoading: contestLoading } = useHomeContests();
  const { data: arenaData, isLoading: arenaLoading } = useHomeArenas();
  const { data: newsData, isLoading: newsLoading } = useHomeNews(6);

  const ratingDetails = ratingsData as RatingsResponse | undefined;

  const ranks = useMemo(
    () => [
      { key: 'skillsRating', title: t('Home.RankInformation.SkillsRating'), icon: 'rating' },
      { key: 'activityRating', title: t('Home.RankInformation.ActivityRating'), icon: 'rating' },
      { key: 'contestsRating', title: t('Home.RankInformation.Contests'), icon: 'contest' },
      { key: 'challengesRating', title: t('Home.RankInformation.Challenges'), icon: 'challenges' },
    ],
    [t],
  );

  const rankItems = ranks.map((rank) => ({
    ...rank,
    metric: formatRating((ratingDetails as Record<string, RatingMetric | undefined>)?.[rank.key]),
  }));

  const contest = contestData?.data?.[0] as Contest | undefined;
  const arena = arenaData?.data?.[0] as Arena | undefined;
  const news =
    (newsData?.data?.map((item) => item.blog).filter(Boolean) as BlogList[]) || [];

  const greetingName = currentUser?.firstName || currentUser?.username || t('home');
  const dateLabel = dayjs().format('dddd, MMM DD, YYYY');

  const hasRankContent = rankItems.some((rank) => rank.metric.value !== undefined || rank.metric.rank !== undefined);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }} sx={{ height: 1 }}>
        <Stack
          component={Card}
          divider={<Divider />}
          spacing={2.5}
          sx={{
            p: { xs: 2, md: 3 },
            height: 1,
            borderRadius: 3,
            bgcolor: 'background.elevation1',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
              {dateLabel}
            </Typography>
            <Typography variant="h5" display="flex" columnGap={1} flexWrap="wrap" fontWeight={700}>
              {t('homeMorningGreeting', { name: greetingName })}
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {rankItems.map((rank) => (
              <RankRow
                key={rank.key}
                icon={rank.icon}
                title={rank.title}
                metric={rank.metric}
                loading={ratingsLoading}
              />
            ))}
            {!ratingsLoading && !hasRankContent && (
              <Typography variant="body2" color="text.secondary">
                {t('homeNoRatings')}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Grid>

      <Grid container size={{ xs: 12, md: 7, lg: 8, xl: 9 }} spacing={3}>
        <Grid size={{ xs: 12, xl: 6.67 }} order={{ lg: 1 }}>
          <Card
            sx={{
              height: 1,
              p: 2,
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.elevation1',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                {t('homeNews')}
              </Typography>
            </Stack>

            {newsLoading ? (
              <Stack direction="row" spacing={2}>
                <Skeleton variant="rounded" height={320} sx={{ flex: 1 }} />
              </Stack>
            ) : news?.length ? (
              <Swiper
                slidesPerView={upLg ? 2.2 : 1.1}
                spaceBetween={16}
                navigation
                pagination={{ clickable: true }}
                style={{ paddingBottom: 24 }}
              >
                {news.map((blog) => (
                  <SwiperSlide key={blog.id}>
                    <NewsCard blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('homeNoNews')}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid container size={{ xs: 12, xl: 5.33 }} spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6, xl: 12 }}>
            <ContestCard contest={contest} loading={contestLoading} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6, xl: 12 }}>
            <ArenaCard arena={arena} loading={arenaLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
