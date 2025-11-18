import { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { demoUser, useAuth } from 'app/providers/AuthProvider.tsx';
import Swiper from 'shared/components/base/Swiper';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import type { ApiNewsListResult } from 'shared/api/orval/generated/endpoints';
import type { KepIconName } from 'shared/config/icons';
import {
  useFirstArena,
  useFirstContest,
  useHomeNews,
  useUserRatings,
} from './hooks.ts';

type RatingKey = 'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating';

type RatingInfo = {
  value?: number;
  rank?: number;
  percentile?: number;
  title?: string;
};

type RatingConfig = {
  key: RatingKey;
  labelKey: string;
  infoKey: string;
  icon: KepIconName;
};

const ratingConfig: RatingConfig[] = [
  { key: 'skillsRating', labelKey: 'SkillsRating', infoKey: 'SkillsRating', icon: 'rating' },
  { key: 'activityRating', labelKey: 'ActivityRating', infoKey: 'ActivityRating', icon: 'rating' },
  { key: 'contestsRating', labelKey: 'ContestsRating', infoKey: 'Contests', icon: 'contest' },
  { key: 'challengesRating', labelKey: 'ChallengesRating', infoKey: 'Challenges', icon: 'challenges' },
];

const parseRating = (rawRating: unknown): RatingInfo => {
  if (!rawRating) return {};

  if (typeof rawRating === 'number') {
    return { value: rawRating };
  }

  if (typeof rawRating === 'string') {
    const numericValue = Number(rawRating);
    return { value: Number.isNaN(numericValue) ? undefined : numericValue };
  }

  if (typeof rawRating === 'object') {
    const rating = rawRating as Record<string, unknown>;
    const parseNumber = (value?: unknown) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };

    return {
      value: parseNumber(rating.value ?? rating.score ?? rating.points),
      rank: parseNumber(rating.rank),
      percentile: parseNumber(rating.percentile),
      title: typeof rating.title === 'string' ? rating.title : undefined,
    };
  }

  return {};
};

const GreetingCard = ({ username }: { username: string }) => {
  const { t } = useTranslation();
  const formattedDate = useMemo(() => dayjs().format('dddd, MMM D, YYYY'), []);

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {formattedDate}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
        {t('homePage.greeting', { name: username })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('homePage.greetingSubtitle')}
      </Typography>
    </Paper>
  );
};

const RatingCard = ({
  label,
  infoKey,
  icon,
  rating,
  loading,
}: {
  label: string;
  infoKey: string;
  icon: KepIconName;
  rating?: RatingInfo;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              border: (theme) => `1px solid ${theme.vars.palette.primary.main}33`,
              bgcolor: (theme) => theme.vars.palette.primary.main + '14',
            }}
          >
            <KepIcon name={icon} color="primary" fontSize={22} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {label}
            </Typography>
            {rating?.title && (
              <Typography variant="body2" color="text.secondary">
                {rating.title}
              </Typography>
            )}
          </Box>
        </Stack>
        <Tooltip title={t(`Home.RankInformation.${infoKey}`)} placement="top">
          <IconButton color="primary" size="small">
            <KepIcon name="question" fontSize={18} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="flex-end" mt={2}>
        {loading ? (
          <Skeleton variant="rectangular" width={80} height={32} />
        ) : (
          <Typography variant="h4" fontWeight={800}>
            {rating?.value ?? '--'}
          </Typography>
        )}
        {rating?.rank !== undefined && !loading && (
          <Typography variant="body2" color="text.secondary">
            #{rating.rank}
          </Typography>
        )}
      </Stack>
      {rating?.percentile !== undefined && !loading && (
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          {t('Home.PercentileInformation', { percentile: rating.percentile })}
        </Typography>
      )}
    </Paper>
  );
};

const RatingsSection = ({ username }: { username?: string }) => {
  const { data: ratingsData, isLoading } = useUserRatings(username);
  const { t } = useTranslation();

  const ratings = useMemo(
    () =>
      ratingConfig.map((config) => ({
        ...config,
        rating: parseRating((ratingsData as Record<string, unknown> | null)?.[config.key]),
      })),
    [ratingsData],
  );

  return (
    <Stack spacing={2}>
      {ratings.map((item) => (
        <RatingCard
          key={item.key}
          label={t(item.labelKey)}
          infoKey={item.infoKey}
          icon={item.icon}
          rating={item.rating}
          loading={isLoading && !ratingsData}
        />
      ))}
    </Stack>
  );
};

const ContestCard = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useFirstContest();
  const contest = data?.data?.[0];

  const startDate = contest?.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest?.finishTime ? dayjs(contest.finishTime) : null;
  const isFinished = finishDate?.isValid() ? finishDate.isBefore(dayjs()) : false;
  const isUpcoming = startDate?.isValid() ? startDate.isAfter(dayjs()) : false;

  return (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
      <Stack spacing={1.5} height="100%">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            {t('homePage.contestTitle')}
          </Typography>
          <KepIcon name="contest" fontSize={22} color="primary" />
        </Stack>
        <Divider />
        {isLoading && !contest ? (
          <Skeleton variant="rounded" height={140} />
        ) : contest ? (
          <Stack spacing={1.5} flex={1}>
            <Typography variant="h6" fontWeight={700}>
              {contest.title}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {contest.categoryTitle && <Chip label={contest.categoryTitle} color="primary" size="small" />}
              {contest.type && <Chip label={contest.type} size="small" variant="soft" color="neutral" />}
              {contest.isRated && <Chip label={t('homePage.ratedContest')} size="small" color="success" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {isUpcoming
                ? t('homePage.contestStart', { value: startDate?.format('MMM D, HH:mm') })
                : t('homePage.contestEnd', { value: finishDate?.format('MMM D, HH:mm') })}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconifyIcon icon="mdi:account-group-outline" fontSize={20} />
              <Typography variant="body2" color="text.secondary">
                {t('homePage.contestParticipants', { count: contest.contestantsCount ?? contest.registrantsCount ?? 0 })}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color={isFinished ? 'neutral' : 'primary'}
              sx={{ alignSelf: 'flex-start', mt: 'auto' }}
            >
              {isFinished ? t('homePage.contestStandings') : t('homePage.contestParticipate')}
            </Button>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.contestFallback')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const ArenaCard = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useFirstArena();
  const arena = data?.data?.[0];

  const startDate =
    arena?.startNaturaltime || (arena?.startTime ? dayjs(arena.startTime).format('MMM D, HH:mm') : undefined);
  const finishDate =
    arena?.finishNaturaltime || (arena?.finishTime ? dayjs(arena.finishTime).format('MMM D, HH:mm') : undefined);

  return (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
      <Stack spacing={1.5} height="100%">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            {t('homePage.arenaTitle')}
          </Typography>
          <KepIcon name="arena" fontSize={22} color="primary" />
        </Stack>
        <Divider />
        {isLoading && !arena ? (
          <Skeleton variant="rounded" height={140} />
        ) : arena ? (
          <Stack spacing={1.5} flex={1}>
            <Typography variant="h6" fontWeight={700}>
              {arena.title}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={t('homePage.arenaQuestions', { count: arena.questionsCount })} size="small" />
              <Chip
                label={t('homePage.arenaDuration', { value: Math.round((arena.timeSeconds ?? 0) / 60) })}
                size="small"
                variant="soft"
                color="neutral"
              />
            </Stack>
            {startDate && (
              <Typography variant="body2" color="text.secondary">
                {t('homePage.arenaStart', { value: startDate })}
              </Typography>
            )}
            {finishDate && (
              <Typography variant="body2" color="text.secondary">
                {t('homePage.arenaFinish', { value: finishDate })}
              </Typography>
            )}
            <Button variant="contained" sx={{ alignSelf: 'flex-start', mt: 'auto' }}>
              {t('homePage.arenaCta')}
            </Button>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.arenaFallback')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const NewsCard = ({ blog }: { blog: ApiNewsListResult['data'][number]['blog'] }) => {
  const tags = useMemo(
    () =>
      blog.tags
        ?.split(',')
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [],
    [blog.tags],
  );

  return (
    <Paper
      sx={{
        height: '100%',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        color: 'common.white',
        backgroundColor: 'grey.900',
      }}
    >
      {blog.image && (
        <Box
          component="img"
          src={blog.image}
          alt={blog.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            opacity: 0.4,
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          p: { xs: 2.5, md: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: (theme) =>
            `linear-gradient(180deg, ${theme.vars.palette.primary.main}33 0%, ${theme.vars.palette.background.default}CC 90%)`,
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          {blog.title}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.5}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" color="neutral" variant="soft" />
          ))}
        </Stack>
        <Stack direction="row" spacing={3} mt="auto" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:message-outline" fontSize={18} />
            <Typography variant="body2">{blog.commentsCount}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:heart-outline" fontSize={18} />
            <Typography variant="body2">{blog.likesCount}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:eye-outline" fontSize={18} />
            <Typography variant="body2">{blog.views}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

const NewsCarousel = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomeNews(6);
  const newsItems = data?.data ?? [];

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={800}>
          {t('homePage.newsTitle')}
        </Typography>
        <Button variant="text" color="primary" size="small">
          {t('homePage.newsSeeAll')}
        </Button>
      </Stack>
      {isLoading && !newsItems.length ? (
        <Skeleton variant="rounded" height={220} />
      ) : newsItems.length ? (
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ pauseOnMouseEnter: true, delay: 6500 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          sx={{ '& .swiper': { pb: 6 } }}
        >
          {newsItems.map((item) => (
            <SwiperSlide key={item.blog.id}>
              <NewsCard blog={item.blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('homePage.newsFallback')}
        </Typography>
      )}
    </Paper>
  );
};

const Home = () => {
  const { currentUser } = useAuth();
  const username = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName ?? ''}`.trim()
    : currentUser?.username || currentUser?.name || demoUser.name;

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, pb: 6 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <GreetingCard username={username} />
            <Divider />
            <RatingsSection username={currentUser?.username} />
          </Stack>
        </Grid>
        <Grid container size={{ xs: 12, lg: 8 }} spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContestCard />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ArenaCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <NewsCarousel />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
