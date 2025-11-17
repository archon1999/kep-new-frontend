import React, { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  type SxProps,
  type Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import dayjs from 'dayjs';
import { getSnippetsAPI } from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';
import { useThemeMode } from 'shared/hooks/useThemeMode';
import useSWR from 'swr';

const RATING_START_DATE = dayjs('2021-07-07');

const rankPresets = [
  {
    key: 'skillsRating',
    title: 'Skills rating',
    value: 67.2,
    rank: 13,
    percentile: 98.2,
    icon: 'solar:ranking-linear',
    accent: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
  },
  {
    key: 'activityRating',
    title: 'Activity rating',
    value: 22.2,
    rank: 22,
    percentile: 97.6,
    icon: 'solar:activity-linear',
    accent: 'linear-gradient(135deg, #22d3ee, #22c55e)',
  },
  {
    key: 'contestsRating',
    title: 'Contests',
    value: 2080,
    rank: 9,
    percentile: 99.1,
    icon: 'mdi:trophy-variant-outline',
    accent: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
  },
  {
    key: 'challengesRating',
    title: 'Challenges',
    value: 1792,
    rank: 19,
    percentile: 95.3,
    icon: 'mdi:lightbulb-on-outline',
    accent: 'linear-gradient(135deg, #f97316, #facc15)',
  },
];

const AuroraCard = ({
  children,
  overlay = false,
  sx = {},
}: {
  children: ReactNode;
  overlay?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        ...(overlay && {
          background: `linear-gradient(145deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
          boxShadow: `0 10px 80px ${theme.palette.primary.main}30`,
          backdropFilter: 'blur(12px)',
        }),
        ...sx,
      }}
    >
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, #22d3ee33, transparent 30%), radial-gradient(circle at 80% 0%, #a855f733, transparent 25%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <CardContent sx={{ position: 'relative' }}>{children}</CardContent>
    </Card>
  );
};

const RankCard = ({
  title,
  value,
  rank,
  percentile,
  icon,
  accent,
}: {
  title: string;
  value: number | string;
  rank: number | string;
  percentile: number | string;
  icon: string;
  accent: string;
}) => {
  const theme = useTheme();
  return (
    <AuroraCard
      overlay
      sx={{
        height: '100%',
        background: `${accent}, ${theme.palette.background.paper}`,
        backgroundBlendMode: 'screen',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            height: 48,
            width: 48,
            borderRadius: 2,
            bgcolor: '#0b1729',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <IconifyIcon icon={icon} width={26} />
        </Box>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" color="text.primary" fontWeight={700}>
            {value}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={`#${rank}`} size="small" color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {percentile}% percentile
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </AuroraCard>
  );
};

const StatChip = ({ label, icon }: { label: string; icon: string }) => (
  <Chip
    icon={<IconifyIcon icon={icon} width={18} />}
    label={label}
    variant="filled"
    color="primary"
    sx={{
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      '& .MuiChip-icon': { color: 'primary.contrastText' },
    }}
  />
);

const useHomeApi = () => useMemo(getSnippetsAPI, []);

const Home = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const api = useHomeApi();
  const { sessionUser } = useAuth();
  const username = sessionUser?.username || sessionUser?.name || 'guest';

  const { data: stats } = useSWR('landing-stats', () => api.apiLandingPageStatisticsList(), {
    fallbackData: null,
  });
  const { data: topRatingData, isLoading: topRatingLoading } = useSWR('top-rating', () =>
    api.apiUsersTopRating({ pageSize: 3 }),
  );
  const { data: birthdaysData, isLoading: birthdaysLoading } = useSWR('next-birthdays', () =>
    api.apiUsersNextBirthdays({ pageSize: 6 }),
  );
  const { data: newsData, isLoading: newsLoading } = useSWR('home-news', () =>
    api.apiNewsList({ pageSize: 3 }),
  );
  const { data: postsData, isLoading: postsLoading } = useSWR('home-posts', () =>
    api.apiBlogList({ pageSize: 6, not_news: '1' }),
  );
  const { data: onlineUsersData } = useSWR('online-users', () =>
    api.apiUsersOnline({ pageSize: 10 }),
  );
  const { data: ratingsData } = useSWR(username ? ['user-ratings', username] : null, () =>
    api.apiUsersRatings(username),
  );

  const rankCards = rankPresets.map((preset) => ({
    ...preset,
    ...(ratingsData as any)?.[preset.key],
  }));

  const landingStats = stats || {
    usersCount: 0,
    attemptsCount: 0,
    contestsCount: 0,
    problemsCount: 0,
  };

  const onlineUsers = onlineUsersData?.data || [];
  const userGrowth = [12, 18, 14, 24, 32, 28, Math.max(landingStats.usersCount % 40, 18)];

  const news = newsData?.data?.map((item) => item.blog) || [];
  const posts = postsData?.data || [];
  const birthdays = birthdaysData?.data || [];
  const today = dayjs();

  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      <AuroraCard
        overlay
        sx={{
          p: { xs: 3, md: 4 },
          background: isDark
            ? 'linear-gradient(145deg, #0b1224, #0f172a)'
            : 'linear-gradient(145deg, #eef2ff, #e0f2fe)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Chip
                label={t('Welcome')}
                color="primary"
                variant="filled"
                sx={{ alignSelf: 'flex-start' }}
              />
              <Typography variant="h4" fontWeight={800} color="text.primary">
                {t('HomePageTitle') || 'Personalized training & community hub'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('HomePageSubtitle') ||
                  'Follow your streaks, track contests, and keep up with what the KEP community is building today.'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Button variant="contained" color="primary">
                  {t('GetStarted') || 'Start a session'}
                </Button>
                <Button variant="outlined" color="secondary">
                  {t('ExploreCommunity') || 'Explore community'}
                </Button>
                <Stack direction="row" spacing={1} sx={{ ml: { xs: 0, sm: 2 } }}>
                  <StatChip label={`${landingStats.contestsCount}+ contests`} icon="mdi:trophy" />
                  <StatChip
                    label={`${landingStats.problemsCount}+ problems`}
                    icon="mdi:lightbulb-outline"
                  />
                  <StatChip
                    label={`${landingStats.attemptsCount}+ attempts`}
                    icon="mdi:chart-line-variant"
                  />
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <AuroraCard
              sx={{
                height: '100%',
                background: 'linear-gradient(160deg, #1e293b, #0f172a)',
                color: 'primary.contrastText',
              }}
              overlay
            >
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="primary.light">
                  Session summary
                </Typography>
                <Typography variant="h3" fontWeight={800}>
                  {sessionUser?.name || sessionUser?.username || 'Guest'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Streak') || 'Streak'}: {(sessionUser as any)?.streak || '—'}
                </Typography>
                <Divider sx={{ borderColor: 'primary.dark', opacity: 0.5 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('Users') || 'Users registered'}
                    </Typography>
                    <Typography variant="h6">{landingStats.usersCount.toLocaleString()}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('Day') || 'Days live'}
                    </Typography>
                    <Typography variant="h6">{today.diff(RATING_START_DATE, 'day')}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </AuroraCard>
          </Grid>
        </Grid>
      </AuroraCard>

      <Grid container spacing={2}>
        {rankCards.map((rank) => (
          <Grid item xs={12} sm={6} md={3} key={rank.key}>
            <RankCard
              title={t(rank.title) || rank.title}
              value={rank.value}
              rank={rank.rank}
              percentile={rank.percentile}
              icon={rank.icon}
              accent={rank.accent}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <AuroraCard overlay>
            <CardHeader
              title={t('TopRating') || 'Top rating'}
              subheader={t('ThisWeek') || 'Updated live'}
              sx={{ px: 0, pt: 0, mb: 1 }}
            />
            <Stack spacing={2}>
              {topRatingLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={48} />
                ))}
              {!topRatingLoading &&
                (topRatingData?.data || []).slice(0, 3).map((user, index) => (
                  <Stack
                    key={user.username}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Box
                      sx={{
                        height: 40,
                        width: 40,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <StatusAvatar
                      src={user.avatar}
                      alt={user.username}
                      status={user.lastSeen ? 'offline' : 'online'}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(user.firstName || '') + ' ' + (user.lastName || '')}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5} textAlign="right">
                      <Typography variant="subtitle2" color="primary.main">
                        {user.skillsRating || user.activityRating || t('Rating') || 'Rating'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('Streak') || 'Streak'}: {user.streak ?? '—'}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
            </Stack>
          </AuroraCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AuroraCard overlay>
            <CardHeader
              title={t('BirthDays') || 'Upcoming birthdays'}
              subheader={t('NeverMiss') || 'Keep the celebration going'}
              sx={{ px: 0, pt: 0, mb: 1 }}
            />
            <Stack spacing={2}>
              {birthdaysLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={56} />
                ))}
              {!birthdaysLoading && birthdays.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t('NoData') || 'No birthdays on the horizon.'}
                </Typography>
              )}
              {!birthdaysLoading &&
                birthdays.map((user: any) => {
                  const date = user.birthDate || user.date || user.birthday || null;
                  return (
                    <Stack key={user.username} direction="row" alignItems="center" spacing={2}>
                      <Avatar src={user.avatar} alt={user.username} />
                      <Stack spacing={0.25} sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{user.username}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {date
                            ? dayjs(date).format('MMM D')
                            : t('DateTBD') || 'Date to be announced'}
                        </Typography>
                      </Stack>
                      <Chip
                        label={(user.kepcoin ?? 0) + ' kp'}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Stack>
                  );
                })}
            </Stack>
          </AuroraCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AuroraCard overlay>
            <CardHeader
              title={t('System') || 'System status'}
              subheader={t('LiveSince') || 'Running since July 2021'}
              sx={{ px: 0, pt: 0, mb: 1 }}
            />
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    height: 64,
                    width: 64,
                    borderRadius: 3,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <IconifyIcon icon="mdi:calendar-clock" width={36} />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="h4" fontWeight={800}>
                    {today.diff(RATING_START_DATE, 'day')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Day') || 'Days online'}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('OnlineNow') || 'Online now'}
                </Typography>
                <AvatarGroup max={6} spacing={10}>
                  {onlineUsers.slice(0, 6).map((user) => (
                    <Avatar key={user.username} src={user.avatar} alt={user.username} />
                  ))}
                </AvatarGroup>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, mt: 1 }}>
                  {userGrowth.map((value, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        height: 64,
                        display: 'flex',
                        alignItems: 'flex-end',
                        '&::after': {
                          content: '""',
                          display: 'block',
                          height: `${Math.max(10, value)}%`,
                          width: '100%',
                          borderRadius: 999,
                          background: 'linear-gradient(180deg, #22d3ee, #4f46e5)',
                          boxShadow: '0 10px 30px rgba(79,70,229,0.3)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Stack>
          </AuroraCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <AuroraCard overlay>
            <CardHeader title={t('LatestNews') || 'Latest news'} sx={{ px: 0, pt: 0, mb: 1 }} />
            <Stack spacing={2}>
              {newsLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={96} />
                ))}
              {!newsLoading &&
                news.map((item) => (
                  <AuroraCard
                    key={item.id}
                    sx={{
                      p: 2,
                      background: item.image
                        ? `linear-gradient(120deg, #0f172aEE, #0f172aEE), url(${item.image}) center/cover`
                        : undefined,
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="overline" color="primary.main">
                        {dayjs(item.created).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.bodyShort || ''}
                      </Typography>
                    </Stack>
                  </AuroraCard>
                ))}
            </Stack>
          </AuroraCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <AuroraCard overlay>
            <CardHeader
              title={t('LastPosts') || 'Recent posts'}
              subheader={t('FromCommunity') || 'Voices from the community'}
              sx={{ px: 0, pt: 0, mb: 1 }}
            />
            <Grid container spacing={2}>
              {postsLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Skeleton variant="rounded" height={140} />
                  </Grid>
                ))}
              {!postsLoading &&
                posts.map((post) => (
                  <Grid item xs={12} sm={6} key={post.id}>
                    <AuroraCard
                      sx={{
                        height: '100%',
                        background: post.image
                          ? `linear-gradient(160deg, #0b1224DD, #0b1224EE), url(${post.image}) center/cover`
                          : undefined,
                      }}
                    >
                      <Stack spacing={1} height="100%">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={post.author?.avatar}
                            alt={post.author?.username}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {post.author?.username}
                          </Typography>
                          <Chip
                            label={`${post.likesCount} ❤`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </Stack>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                          {post.bodyShort || ''}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(post.created).format('MMM D, YYYY')}
                          </Typography>
                          <Chip
                            label={`${post.commentsCount} comments`}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                    </AuroraCard>
                  </Grid>
                ))}
            </Grid>
          </AuroraCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Home;
