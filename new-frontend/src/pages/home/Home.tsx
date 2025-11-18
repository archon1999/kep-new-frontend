import { useMemo } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import type {
  ApiArenaListResult,
  ApiContestsListResult,
  ApiNewsListResult,
  UserList,
} from 'shared/api/orval/generated/endpoints';
import { useFeaturedArena, useFeaturedContest, useHomeNews, useUserRatings } from './hooks';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

type RatingEntry = {
  value?: number;
  rank?: number;
  percentile?: number;
};

type RatingsResponse = UserList & {
  skillsRating?: RatingEntry;
  activityRating?: RatingEntry;
  contestsRating?: RatingEntry;
  challengesRating?: RatingEntry;
};

const RankRow = ({
  icon,
  label,
  value,
  rank,
  subtitle,
  loading,
}: {
  icon: Parameters<typeof KepIcon>[0]['name'];
  label: string;
  value?: number;
  rank?: number;
  subtitle?: string;
  loading?: boolean;
}) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 2,
      borderColor: 'divider',
      boxShadow: 'none',
      bgcolor: 'background.paper',
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 2,
          bgcolor: 'primary.light',
          color: 'primary.main',
        }}
      >
        <KepIcon name={icon} width={24} height={24} />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>

      {loading ? (
        <Skeleton variant="rectangular" width={80} height={28} />
      ) : (
        <Stack spacing={0.25} textAlign="right">
          <Typography variant="h6" fontWeight={700} lineHeight={1.1}>
            {value ?? '—'}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {rank ? `#${rank}` : '—'}
          </Typography>
        </Stack>
      )}
    </CardContent>
  </Card>
);

const ContestCard = ({ contest }: { contest?: ApiContestsListResult['data'][number] }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              }}
            >
              <KepIcon name="contest" width={26} height={26} />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                {t('homePage.contestCardTitle')}
              </Typography>
              <Typography variant="h6">{contest?.title ?? t('homePage.noContest')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {contest?.startTime
                  ? dayjs(contest.startTime).format('MMM D, YYYY • HH:mm')
                  : t('homePage.contestNoDate')}
              </Typography>
            </Stack>
          </Stack>

          <Button variant="contained" disabled={!contest} size="small">
            {t('homePage.contestAction')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ArenaCard = ({ arena }: { arena?: ApiArenaListResult['data'][number] }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                bgcolor: 'warning.lighter',
                color: 'warning.main',
              }}
            >
              <KepIcon name="arena" width={26} height={26} />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                {t('homePage.arenaCardTitle')}
              </Typography>
              <Typography variant="h6">{arena?.title ?? t('homePage.noArena')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {arena?.startTime
                  ? dayjs(arena.startTime).format('MMM D, YYYY • HH:mm')
                  : t('homePage.arenaNoDate')}
              </Typography>
            </Stack>
          </Stack>

          <Button variant="outlined" disabled={!arena} size="small">
            {t('homePage.arenaAction')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const NewsSlider = ({ news }: { news?: ApiNewsListResult }) => {
  const { t } = useTranslation();

  if (!news?.data?.length) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={1.5}>
            {t('homePage.newsTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('homePage.noNews')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{t('homePage.newsTitle')}</Typography>
          <IconifyIcon icon="mdi:chevron-right" width={22} />
        </Stack>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={1.05}
          breakpoints={{
            768: { slidesPerView: 2.1 },
            1200: { slidesPerView: 3.1 },
          }}
          style={{ paddingBottom: '12px' }}
        >
          {news.data.map(({ blog }) => {
            const tags = blog.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? [];

            return (
              <SwiperSlide key={blog.id ?? blog.title}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: '100%',
                    minHeight: 240,
                  }}
                >
                  {blog.image ? (
                    <Box
                      component="img"
                      src={blog.image}
                      alt={blog.title}
                      sx={{ width: 1, height: 1, objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 1,
                        height: 1,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {blog.title}
                    </Box>
                  )}

                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.75) 100%)',
                      color: 'common.white',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
                        {blog.title}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {tags.map((tag) => (
                          <Box
                            key={tag}
                            sx={{
                              bgcolor: 'common.white',
                              color: 'grey.900',
                              borderRadius: 1.5,
                              px: 1,
                              py: 0.25,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            #{tag}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconifyIcon icon="mdi:message-text-outline" width={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {blog.commentsCount}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconifyIcon icon="mdi:heart-outline" width={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {blog.likesCount}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconifyIcon icon="mdi:eye-outline" width={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {blog.views ?? 0}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const displayName = currentUser?.firstName || currentUser?.username || t('homePage.fallbackName');

  const formattedDate = useMemo(() => dayjs().format('dddd, MMM D, YYYY'), []);
  const { data: ratings, isLoading: ratingsLoading } = useUserRatings(currentUser?.username);
  const { data: contests } = useFeaturedContest();
  const { data: arenas } = useFeaturedArena();
  const { data: news } = useHomeNews(6);

  const ratingsData = ratings as RatingsResponse | undefined;

  const rankItems = [
    {
      key: 'skillsRating',
      label: t('homePage.ranks.skills'),
      icon: 'rating' as const,
      entry: ratingsData?.skillsRating,
    },
    {
      key: 'activityRating',
      label: t('homePage.ranks.activity'),
      icon: 'statistics' as const,
      entry: ratingsData?.activityRating,
    },
    {
      key: 'contestsRating',
      label: t('homePage.ranks.contests'),
      icon: 'contests' as const,
      entry: (ratingsData as RatingsResponse & { contestsRating?: RatingEntry })?.contestsRating,
    },
    {
      key: 'challengesRating',
      label: t('homePage.ranks.challenges'),
      icon: 'challenges' as const,
      entry: (ratingsData as RatingsResponse & { challengesRating?: RatingEntry })?.challengesRating,
    },
  ];

  const contest = contests?.data?.[0];
  const arena = arenas?.data?.[0];

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {t('homePage.greeting', { name: displayName })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('homePage.greetingSubtitle')}
                </Typography>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('homePage.ranks.title')}
                </Typography>
                <Grid container spacing={1.5}>
                  {rankItems.map(({ key, label, icon, entry }) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <RankRow
                        icon={icon}
                        label={label}
                        value={entry?.value}
                        rank={entry?.rank}
                        subtitle={
                          entry?.percentile
                            ? t('homePage.percentile', { value: entry.percentile })
                            : t('homePage.ranks.subtitle')
                        }
                        loading={ratingsLoading}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5}>
            <ContestCard contest={contest} />
            <ArenaCard arena={arena} />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <NewsSlider news={news} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
