import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import KepIcon from 'shared/components/base/KepIcon';
import Swiper from 'shared/components/base/Swiper';
import { SwiperSlide } from 'swiper/react';
import {
  useHomeArena,
  useHomeContest,
  useHomeNews,
  useUserRatings,
} from './hooks';
import NewsCard from './components/NewsCard';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const name = currentUser?.firstName || currentUser?.username || t('homePage.guest');

  const { data: ratings, isLoading: ratingsLoading } = useUserRatings(currentUser?.username);
  const { data: contestData, isLoading: contestsLoading } = useHomeContest();
  const { data: arenaData, isLoading: arenasLoading } = useHomeArena();
  const { data: newsData, isLoading: newsLoading } = useHomeNews(6);

  const contest = contestData?.data?.[0];
  const arena = arenaData?.data?.[0];

  const ratingRows = useMemo(
    () => [
      {
        key: 'skillsRating',
        label: t('homePage.ranks.skills'),
        icon: 'rating' as const,
        data: ratings?.skillsRating,
      },
      {
        key: 'activityRating',
        label: t('homePage.ranks.activity'),
        icon: 'challenge' as const,
        data: ratings?.activityRating,
      },
      {
        key: 'contestsRating',
        label: t('homePage.ranks.contests'),
        icon: 'contest' as const,
        data: ratings?.contestsRating,
      },
      {
        key: 'challengesRating',
        label: t('homePage.ranks.challenges'),
        icon: 'challenges' as const,
        data: ratings?.challengesRating,
      },
    ],
    [ratings?.activityRating, ratings?.challengesRating, ratings?.contestsRating, ratings?.skillsRating, t],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ height: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {dayjs(new Date()).format('dddd, MMM DD, YYYY')}
                </Typography>
                <Typography variant="h5" display="flex" gap={1} flexWrap="wrap" alignItems="baseline">
                  {t('homePage.greeting')}, <Typography component="span" variant="h5">{name}!</Typography>
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('homePage.ranks.title')}
                </Typography>
                <Stack spacing={1.5}>
                  {ratingRows.map(({ key, label, icon, data }) => (
                    <Card
                      key={key}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        bgcolor: 'background.elevation1',
                        borderColor: 'divider',
                      }}
                    >
                      {ratingsLoading && !data ? (
                        <Skeleton variant="rounded" height={48} />
                      ) : (
                        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: 'primary.lighter',
                                color: 'primary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <KepIcon name={icon} fontSize={22} />
                            </Avatar>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                {label}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="baseline">
                                <Typography variant="h6" fontWeight={700}>
                                  {data?.value ?? '--'}
                                </Typography>
                                {data?.rank !== undefined && (
                                  <Chip label={`#${data.rank}`} size="small" variant="soft" color="primary" />
                                )}
                              </Stack>
                            </Stack>
                          </Stack>

                          {data?.percentile !== undefined && (
                            <Chip
                              label={t('homePage.ranks.percentile', { percentile: data.percentile })}
                              size="small"
                              color="secondary"
                              variant="soft"
                            />
                          )}
                        </Stack>
                      )}
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid container size={{ xs: 12, md: 7, lg: 8 }} spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<KepIcon name="contest" fontSize={22} />}
                title={t('homePage.contest.title')}
                subheader={contest?.categoryTitle}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {contestsLoading && !contest ? (
                  <Skeleton variant="rounded" height={140} />
                ) : contest ? (
                  <>
                    <Typography variant="h6" fontWeight={700}>
                      {contest.title}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {contest.status && (
                        <Chip label={contest.status} size="small" color="primary" variant="soft" />
                      )}
                      {contest.isRated !== undefined && (
                        <Chip
                          label={contest.isRated ? t('homePage.contest.rated') : t('homePage.contest.unrated')}
                          size="small"
                          color={contest.isRated ? 'success' : 'default'}
                          variant="soft"
                        />
                      )}
                      <Chip label={contest.type} size="small" variant="outlined" />
                    </Stack>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="calendar" fontSize={18} />
                        <Typography variant="body2" color="text.secondary">
                          {t('homePage.contest.starts')}{' '}
                          {contest.startTime ? dayjs(contest.startTime).format('MMM D, HH:mm') : '--'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="clock" fontSize={18} />
                        <Typography variant="body2" color="text.secondary">
                          {contest.finishTime
                            ? dayjs(contest.finishTime).format('MMM D, HH:mm')
                            : t('homePage.contest.durationUnknown')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <KepIcon name="problems" fontSize={18} />
                          <Typography variant="body2">
                            {t('homePage.contest.problems', { count: contest.problemsCount })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <KepIcon name="users" fontSize={18} />
                          <Typography variant="body2">
                            {t('homePage.contest.participants', { count: contest.contestantsCount ?? 0 })}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('homePage.contest.empty')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader avatar={<KepIcon name="arena" fontSize={22} />} title={t('homePage.arena.title')} />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {arenasLoading && !arena ? (
                  <Skeleton variant="rounded" height={140} />
                ) : arena ? (
                  <>
                    <Typography variant="h6" fontWeight={700}>
                      {arena.title}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        label={arena.status === 1 ? t('homePage.arena.live') : t('homePage.arena.upcoming')}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={t('homePage.arena.questions', { count: arena.questionsCount })}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="calendar" fontSize={18} />
                        <Typography variant="body2" color="text.secondary">
                          {t('homePage.arena.starts')} {dayjs(arena.startTime).format('MMM D, HH:mm')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="clock" fontSize={18} />
                        <Typography variant="body2" color="text.secondary">
                          {t('homePage.arena.ends')} {dayjs(arena.finishTime).format('MMM D, HH:mm')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="timer" fontSize={18} />
                        <Typography variant="body2" color="text.secondary">
                          {t('homePage.arena.duration', { duration: Math.round(arena.timeSeconds / 60) })}
                        </Typography>
                      </Stack>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('homePage.arena.empty')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('homePage.news')}
        </Typography>
        {newsLoading && !newsData?.data?.length ? (
          <Skeleton variant="rounded" height={320} />
        ) : newsData?.data?.length ? (
          <Swiper
            navigation
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              600: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {newsData.data.map((item) => (
              <SwiperSlide key={item.blog.id ?? item.blog.title}>
                <NewsCard blog={item.blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.newsEmpty')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Home;
