import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import type {
  ApiArenaListResult,
  ApiContestsListResult,
  ApiNewsListResult,
} from 'shared/api/orval/generated/endpoints';
import { useFeaturedArena, useFeaturedContest, useHomeNews, useUserRatings } from './hooks';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type RatingStat = {
  value?: number | null;
  rank?: number | null;
  percentile?: number | null;
};

type UserRatings = Partial<Record<'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating', RatingStat>>;

type ContestPreview = ApiContestsListResult['data'][number] | undefined;
type ArenaPreview = ApiArenaListResult['data'][number] | undefined;
type NewsPreview = ApiNewsListResult['data'][number]['blog'];

const formatDateTime = (value?: string | null) => (value ? dayjs(value).format('MMM D, YYYY HH:mm') : '—');

const RankRow = ({
  icon,
  label,
  value,
  rank,
  loading,
}: {
  icon: Parameters<typeof KepIcon>[0]['name'];
  label: string;
  value?: number | null;
  rank?: number | null;
  loading?: boolean;
}) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    sx={{
      px: 2,
      py: 1.5,
      bgcolor: 'background.elevation1',
      borderRadius: 2,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
      <KepIcon name={icon} fontSize={22} />
    </Avatar>

    <Stack spacing={0.5} flex={1} minWidth={0}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ lineClamp: 1 }}>
        {label}
      </Typography>

      {loading ? (
        <Skeleton width={120} />
      ) : (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
            {value ?? '—'}
          </Typography>
          {rank ? (
            <Chip size="small" label={`#${rank}`} color="primary" variant="outlined" />
          ) : (
            <Chip size="small" label="—" variant="outlined" />
          )}
        </Stack>
      )}
    </Stack>
  </Stack>
);

const UserPanel = ({
  dateLabel,
  greeting,
  ratings,
  loading,
  t,
}: {
  dateLabel: string;
  greeting: string;
  ratings?: UserRatings;
  loading?: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  const rankItems = useMemo(
    () => [
      { key: 'skillsRating', label: t('homePage.skillsRating'), icon: 'rating' as const },
      { key: 'activityRating', label: t('homePage.activityRating'), icon: 'statistics' as const },
      { key: 'contestsRating', label: t('homePage.contestsRating'), icon: 'contests' as const },
      { key: 'challengesRating', label: t('homePage.challengesRating'), icon: 'challenges' as const },
    ],
    [t],
  );

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          {dateLabel}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.3 }}>
          {greeting}
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={1.5} flex={1} minHeight={0}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {t('homePage.ranksTitle')}
        </Typography>

        <Stack spacing={1.25}>
          {rankItems.map(({ key, label, icon }) => (
            <RankRow
              key={key}
              icon={icon}
              label={label}
              value={ratings?.[key]?.value}
              rank={ratings?.[key]?.rank}
              loading={loading}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

const StatChip = ({ icon, label }: { icon: string; label: string }) => (
  <Chip
    variant="outlined"
    size="small"
    icon={<IconifyIcon icon={icon} fontSize={16} />}
    label={label}
    sx={{ borderRadius: 1.5 }}
  />
);

const ContestCard = ({ contest, loading, t }: { contest?: ContestPreview; loading?: boolean; t: ReturnType<typeof useTranslation>['t'] }) => (
  <Paper
    sx={{
      p: { xs: 3, md: 4 },
      height: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
          <KepIcon name="contest" fontSize={22} />
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700}>
          {t('homePage.contestCardTitle')}
        </Typography>
      </Stack>
      {contest?.isRated && <Chip size="small" color="primary" label={t('homePage.rated')} variant="outlined" />}
    </Stack>

    {loading ? (
      <Stack spacing={1.5}>
        <Skeleton width="70%" height={32} />
        <Skeleton width="50%" />
        <Skeleton width="60%" />
      </Stack>
    ) : contest ? (
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={800} sx={{ lineClamp: 2 }}>
          {contest.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contest.status === 'FINISHED' ? contest.finishNaturaltime ?? formatDateTime(contest.finishTime) : contest.startNaturaltime ?? formatDateTime(contest.startTime)}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <StatChip icon="mdi:account-multiple-outline" label={`${contest.contestantsCount} ${t('homePage.contestants')}`} />
          <StatChip icon="mdi:clipboard-text-outline" label={`${contest.problemsCount} ${t('homePage.problems')}`} />
          <StatChip icon="mdi:medal-outline" label={contest.categoryTitle} />
        </Stack>

        <Button variant="contained" size="large" sx={{ alignSelf: 'flex-start', mt: 'auto' }} disabled>
          {t('homePage.viewContest')}
        </Button>
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('homePage.noContest')}
      </Typography>
    )}
  </Paper>
);

const ArenaCard = ({ arena, loading, t }: { arena?: ArenaPreview; loading?: boolean; t: ReturnType<typeof useTranslation>['t'] }) => (
  <Paper
    sx={{
      p: { xs: 3, md: 4 },
      height: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ bgcolor: 'secondary.lighter', color: 'secondary.main' }}>
          <KepIcon name="arena" fontSize={22} />
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700}>
          {t('homePage.arenaCardTitle')}
        </Typography>
      </Stack>
    </Stack>

    {loading ? (
      <Stack spacing={1.5}>
        <Skeleton width="60%" height={32} />
        <Skeleton width="50%" />
        <Skeleton width="70%" />
      </Stack>
    ) : arena ? (
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={800} sx={{ lineClamp: 2 }}>
          {arena.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {arena.startNaturaltime ?? formatDateTime(arena.startTime)}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <StatChip icon="mdi:clock-outline" label={`${arena.timeSeconds / 60} ${t('homePage.minutes')}`} />
          <StatChip icon="mdi:help-circle-outline" label={`${arena.questionsCount} ${t('homePage.questions')}`} />
          {arena.winner && <StatChip icon="mdi:trophy-outline" label={`${t('homePage.winner')}: ${arena.winner}`} />}
        </Stack>
        <Button variant="outlined" size="large" sx={{ alignSelf: 'flex-start', mt: 'auto' }} disabled>
          {t('homePage.viewArena')}
        </Button>
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('homePage.noArena')}
      </Typography>
    )}
  </Paper>
);

const NewsCard = ({ blog }: { blog: NewsPreview }) => {
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
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.elevation2',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {blog.image && (
        <Box
          component="img"
          src={blog.image}
          alt={blog.title}
          sx={{
            width: 1,
            height: 200,
            objectFit: 'cover',
          }}
        />
      )}

      <Stack spacing={1} sx={{ p: 2.5, flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ lineClamp: 2 }}>
          {blog.title}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tags.map((tag) => (
            <Chip key={tag} size="small" label={tag} variant="outlined" />
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3 }}>
          {blog.bodyShort}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary" mt="auto">
          <IconifyIcon icon="mdi:message-outline" fontSize={18} />
          <Typography variant="caption">{blog.commentsCount}</Typography>
          <IconifyIcon icon="mdi:heart-outline" fontSize={18} />
          <Typography variant="caption">{blog.likesCount}</Typography>
          <IconifyIcon icon="mdi:eye-outline" fontSize={18} />
          <Typography variant="caption">{blog.views}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

const NewsSlider = ({ news, loading, t }: { news: NewsPreview[]; loading?: boolean; t: ReturnType<typeof useTranslation>['t'] }) => (
  <Paper sx={{ p: { xs: 3, md: 4 } }}>
    <Stack spacing={2.5}>
      <Typography variant="h6" fontWeight={800}>
        {t('homePage.newsTitle')}
      </Typography>

      {loading ? (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} variant="rounded" width={320} height={260} />
          ))}
        </Stack>
      ) : news.length ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          autoplay={{ pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            900: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: 24 }}
        >
          {news.map((item) => (
            <SwiperSlide key={item.id ?? item.title} style={{ height: 'auto' }}>
              <Box sx={{ height: 1 }}>
                <NewsCard blog={item} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('homePage.noNews')}
        </Typography>
      )}
    </Stack>
  </Paper>
);

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data: ratingsData, isLoading: ratingsLoading } = useUserRatings(username);
  const { data: contestData, isLoading: contestLoading } = useFeaturedContest();
  const { data: arenaData, isLoading: arenaLoading } = useFeaturedArena();
  const { data: newsData, isLoading: newsLoading } = useHomeNews(6);

  const greetingName = currentUser?.firstName || currentUser?.username || t('homePage.defaultUserName');
  const contest = contestData?.data?.[0];
  const arena = arenaData?.data?.[0];
  const news = newsData?.data?.map((item) => item.blog).filter(Boolean) ?? [];

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={5} lg={4} xl={3} sx={{ height: 1 }}>
          <UserPanel
            dateLabel={dayjs().format('dddd, MMM DD, YYYY')}
            greeting={t('homePage.greeting', { name: greetingName })}
            ratings={ratingsData as unknown as UserRatings}
            loading={ratingsLoading}
            t={t}
          />
        </Grid>

        <Grid container xs={12} md={7} lg={8} xl={9} spacing={3}>
          <Grid xs={12} xl={7}>
            <ContestCard contest={contest} loading={contestLoading} t={t} />
          </Grid>
          <Grid xs={12} xl={5}>
            <ArenaCard arena={arena} loading={arenaLoading} t={t} />
          </Grid>

          <Grid xs={12}>
            <NewsSlider news={news} loading={newsLoading} t={t} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
