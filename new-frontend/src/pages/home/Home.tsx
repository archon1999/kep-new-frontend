import { useMemo } from 'react';
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useHomeNews, useLatestArena, useLatestContest, useUserRatings } from './hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

dayjs.extend(relativeTime);

type RatingInfo = {
  value?: number | string;
  rank?: number | string;
  percentile?: number | string;
};

const RankRow = ({
  title,
  icon,
  value,
  rank,
  percentile,
}: {
  title: string;
  icon: string;
  value?: number | string;
  rank?: number | string;
  percentile?: number | string;
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: 'primary.lighter',
            color: 'primary.main',
            width: 48,
            height: 48,
          }}
        >
          <IconifyIcon icon={icon} fontSize={24} />
        </Avatar>

        <Stack spacing={0.5}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            {value ?? '--'}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={0.5} alignItems="flex-end">
        <Chip
          size="small"
          color="primary"
          variant="soft"
          label={`#${rank ?? '--'}`}
          sx={{ fontWeight: 600 }}
        />
        <Typography variant="caption" color="text.secondary">
          Top {percentile ?? '--'}%
        </Typography>
      </Stack>
    </Paper>
  );
};

const ContestCard = () => {
  const { data } = useLatestContest();
  const contest = data?.data?.[0];

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, height: 1 }}>
      <Stack spacing={2} height={1} justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Upcoming contest
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
            {contest?.title ?? 'Contest not found'}
          </Typography>
          {contest?.categoryTitle && (
            <Chip size="small" variant="soft" color="primary" label={contest.categoryTitle} />
          )}
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="solar:calendar-bold-duotone" fontSize={20} />
            <Typography variant="body2" color="text.secondary">
              {contest?.startTime ? dayjs(contest.startTime).format('MMM DD, YYYY HH:mm') : 'No start time'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="solar:users-group-rounded-bold-duotone" fontSize={20} />
            <Typography variant="body2" color="text.secondary">
              {contest?.registrantsCount ?? 0} registrants • {contest?.contestantsCount ?? 0} contestants
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const ArenaCard = () => {
  const { data } = useLatestArena();
  const arena = data?.data?.[0];

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, height: 1 }}>
      <Stack spacing={2} height={1} justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Arena spotlight
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
            {arena?.title ?? 'Arena not found'}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="solar:clock-circle-bold-duotone" fontSize={20} />
            <Typography variant="body2" color="text.secondary">
              {arena?.startNaturaltime ?? (arena?.startTime ? dayjs(arena.startTime).fromNow() : 'TBD')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconifyIcon icon="solar:question-circle-bold-duotone" fontSize={20} />
            <Typography variant="body2" color="text.secondary">
              {arena?.questionsCount ?? 0} tasks • {arena?.timeSeconds ?? 0}s
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const NewsCard = ({
  title,
  image,
  tags,
  stats,
}: {
  title: string;
  image?: string | null;
  tags: string[];
  stats: {
    comments: number;
    likes: number;
    views?: number;
  };
}) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        height: 240,
        display: 'flex',
      }}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            inset: 0,
            position: 'absolute',
            width: 1,
            height: 1,
            objectFit: 'cover',
            filter: 'brightness(0.45)',
          }}
        />
      )}

      <Stack spacing={1.5} sx={{ position: 'relative', p: 3, color: 'common.white', flex: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ lineClamp: 2 }}>
          {title}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip key={tag} size="small" label={tag} color="primary" variant="soft" sx={{ color: 'common.white' }} />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconifyIcon icon="solar:chat-round-dots-bold-duotone" fontSize={18} />
            <Typography variant="body2">{stats.comments}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconifyIcon icon="solar:heart-bold-duotone" fontSize={18} />
            <Typography variant="body2">{stats.likes}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconifyIcon icon="solar:eye-bold-duotone" fontSize={18} />
            <Typography variant="body2">{stats.views ?? 0}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const Home = () => {
  const { currentUser } = useAuth();
  const username = currentUser?.username ?? currentUser?.name ?? null;
  const greetingName =
    currentUser?.firstName ?? currentUser?.name ?? currentUser?.username ?? 'Captain';

  const { data: ratingsData } = useUserRatings(username);
  const { data: newsData } = useHomeNews(6);

  const ratingPayload = ratingsData as Record<string, RatingInfo> | undefined;

  const ratingRows = useMemo(
    () =>
      [
        { key: 'skillsRating', title: 'Skills rating', icon: 'solar:ranking-bold-duotone' },
        { key: 'activityRating', title: 'Activity rating', icon: 'solar:bolt-circle-bold-duotone' },
        { key: 'contestsRating', title: 'Contests rating', icon: 'solar:trophy-bold-duotone' },
        { key: 'challengesRating', title: 'Challenges rating', icon: 'solar:target-bold-duotone' },
      ].map(({ key, ...rest }) => ({
        ...rest,
        ...(ratingPayload?.[key] ?? {}),
      })),
    [ratingPayload],
  );

  const newsItems = newsData?.data ?? [];

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ height: 1 }}>
          <Paper component={Stack} divider={<Divider flexItem />} spacing={3} sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {dayjs(new Date()).format('dddd, MMM DD, YYYY')}
              </Typography>
              <Typography variant="h6" display="flex" columnGap={1} flexWrap="wrap">
                Good morning,
                <Typography component="span" variant="h6" fontWeight={700}>
                  {greetingName}!
                </Typography>
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {ratingRows.map((rank) => (
                <RankRow key={rank.title} {...rank} />
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid container size={{ xs: 12, md: 7, lg: 8 }} spacing={3}>
          <Grid size={{ xs: 12, md: 12, lg: 6 }}>
            <ContestCard />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 6 }}>
            <ArenaCard />
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Latest news
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Swipe to explore updates
          </Typography>
        </Stack>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: 32 }}
        >
          {newsItems.map(({ blog }) => {
            const tags = (blog.tags?.split(',') ?? [])
              .map((tag) => tag.trim())
              .filter(Boolean);

            return (
              <SwiperSlide key={blog.id}>
                <NewsCard
                  title={blog.title}
                  image={blog.image ?? undefined}
                  tags={tags}
                  stats={{
                    comments: blog.commentsCount ?? 0,
                    likes: blog.likesCount ?? 0,
                    views: blog.views,
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
};

export default Home;
