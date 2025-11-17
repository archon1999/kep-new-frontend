import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import dayjs from 'dayjs';
import {
  ApiBlogList200,
  ApiNewsList200,
  ApiUsersNextBirthdays200,
  ApiUsersOnline200,
  ApiUsersTopRating200,
  LandingPageStatistics,
  UserList,
} from 'shared/api/orval/generated/endpoints';
import useSWR from 'swr';

const formatNumber = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString('en-US') : '–';

const GradientBackplate = () => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        filter: 'blur(100px)',
        opacity: 0.35,
        transform: 'translate3d(0,0,0)',
      },
      '&::before': {
        width: 320,
        height: 320,
        top: -60,
        right: 40,
        background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.4), transparent 60%)',
      },
      '&::after': {
        width: 420,
        height: 420,
        bottom: -120,
        left: -60,
        background: 'radial-gradient(circle at 70% 40%, rgba(236,72,153,0.35), transparent 55%)',
      },
    }}
  />
);

const GlassPaper = ({ children }: { children: ReactNode }) => (
  <Paper
    elevation={0}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(18px)',
      border: '1px solid',
      borderColor: 'divider',
      background: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(18, 23, 40, 0.8)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 4,
    }}
  >
    {children}
  </Paper>
);

const StatCard = ({
  title,
  value,
  icon,
  accent,
  loading,
}: {
  title: string;
  value?: number;
  icon: string;
  accent: string;
  loading?: boolean;
}) => (
  <GlassPaper>
    <Box
      sx={{
        height: '100%',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            background: accent,
            color: '#0f172a',
          }}
        >
          <Icon icon={icon} fontSize={22} />
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      {loading ? (
        <Skeleton variant="rectangular" height={28} sx={{ borderRadius: 1.5 }} />
      ) : (
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {formatNumber(value)}
        </Typography>
      )}
    </Box>
  </GlassPaper>
);

const UserLine = ({ user, rank }: { user: UserList; rank?: number }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} py={1.2}>
    <Avatar
      src={user.avatar}
      alt={user.username}
      sx={{
        width: 44,
        height: 44,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        boxShadow: rank ? 3 : 0,
      }}
    >
      {rank}
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        @{user.username}
      </Typography>
    </Box>
    {typeof user.kepcoin === 'number' && (
      <Chip
        label={`${user.kepcoin}⚡`}
        size="small"
        sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}
      />
    )}
  </Stack>
);

const BlogCard = ({
  title,
  summary,
  author,
  image,
}: {
  title: string;
  summary?: string | null;
  author?: string;
  image?: string | null;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      borderRadius: 3,
      borderColor: 'divider',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(20, 24, 38, 0.9)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 80%)',
    }}
  >
    <CardActionArea sx={{ height: '100%', alignItems: 'stretch' }}>
      {image && (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            height: 160,
            width: 1,
            objectFit: 'cover',
          }}
        />
      )}
      <CardContent sx={{ display: 'grid', gap: 1 }}>
        <Typography variant="overline" color="text.secondary">
          {author ? `@${author}` : 'Announcement'}
        </Typography>
        <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
          {title}
        </Typography>
        {summary && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {summary}
          </Typography>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
);

const EmptyState = ({ label }: { label: string }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 3,
      borderRadius: 3,
      textAlign: 'center',
      borderColor: 'divider',
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { sessionUser } = useAuth();

  const greetingName = sessionUser?.firstName || sessionUser?.username || t('guest', 'Guest');
  const uptimeDays = useMemo(() => dayjs().diff(dayjs('2021-07-07'), 'day'), []);
  const today = useMemo(() => dayjs(), []);

  const { data: stats, isLoading: statsLoading } = useSWR<LandingPageStatistics>(
    '/landing-page-statistics',
  );
  const { data: news, isLoading: newsLoading } = useSWR<ApiNewsList200>([
    '/news',
    { params: { pageSize: 3 } },
  ]);
  const { data: posts, isLoading: postsLoading } = useSWR<ApiBlogList200>([
    '/blog',
    { params: { page: 1, page_size: 6, not_news: 1 } },
  ]);
  const { data: topRating, isLoading: topRatingLoading } = useSWR<ApiUsersTopRating200>([
    '/users/top-rating',
    { params: { pageSize: 5 } },
  ]);
  const { data: birthdays, isLoading: birthdaysLoading } = useSWR<ApiUsersNextBirthdays200>([
    '/users/next-birthdays',
    { params: { pageSize: 6 } },
  ]);
  const { data: onlineUsers } = useSWR<ApiUsersOnline200>([
    '/users/online',
    { params: { pageSize: 12 } },
  ]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100%', py: { xs: 4, md: 6 } }}>
      <GradientBackplate />

      <Stack spacing={3} position="relative">
        <GlassPaper>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              display: 'grid',
              gridTemplateColumns: { md: '1.2fr 1fr' },
              gap: { xs: 2, md: 3 },
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(236,72,153,0.2))'
                  : 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 90%)',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={800} color="text.primary">
                {t('home.greeting', 'Welcome back')}, {greetingName} 👋
              </Typography>
              <Typography color="text.secondary" maxWidth={640}>
                {t(
                  'home.subtitle',
                  'Here is a quick overview of what is happening around KEP. Stay curious and keep building.',
                )}
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Chip
                  color="primary"
                  variant="outlined"
                  icon={<Icon icon="solar:graph-up-broken" />}
                  label={`${formatNumber(stats?.attemptsCount)} ${t('home.attempts', 'Submissions')}`}
                />
                <Chip
                  color="secondary"
                  variant="outlined"
                  icon={<Icon icon="solar:cup-star-broken" />}
                  label={`${formatNumber(stats?.contestsCount)} ${t('home.contests', 'Contests')}`}
                />
                <Chip
                  variant="outlined"
                  icon={<Icon icon="solar:book-2-broken" />}
                  label={`${formatNumber(stats?.problemsCount)} ${t('home.problems', 'Problems')}`}
                />
              </Stack>
            </Stack>

            <Box
              sx={{
                position: 'relative',
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 4,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {today.format('dddd, MMM D')}
              </Typography>
              <Typography variant="h3" fontWeight={800} mt={1}>
                {today.format('HH:mm')}
              </Typography>
              <Stack direction="row" spacing={2} mt={2} alignItems="center">
                <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  {onlineUsers?.data?.map((user) => (
                    <Avatar key={user.username} src={user.avatar} alt={user.username} />
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  {t('home.onlineNow', 'People online right now')}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min((onlineUsers?.count || 0) * 2, 100)}
                sx={{ mt: 2.5, borderRadius: 3 }}
              />
            </Box>
          </Box>
        </GlassPaper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              title={t('home.users', 'Community members')}
              value={stats?.usersCount}
              icon="solar:users-group-rounded-broken"
              accent="linear-gradient(145deg, #a5b4fc, #c7d2fe)"
              loading={statsLoading}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title={t('home.problems', 'Problems')}
              value={stats?.problemsCount}
              icon="solar:code-square-broken"
              accent="linear-gradient(145deg, #fbcfe8, #f472b6)"
              loading={statsLoading}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title={t('home.contests', 'Contests')}
              value={stats?.contestsCount}
              icon="solar:trophy-broken"
              accent="linear-gradient(145deg, #fde68a, #fbbf24)"
              loading={statsLoading}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title={t('home.attempts', 'Submissions')}
              value={stats?.attemptsCount}
              icon="solar:flash-square-broken"
              accent="linear-gradient(145deg, #99f6e4, #34d399)"
              loading={statsLoading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <GlassPaper>
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('home.latestNews', 'Latest news')}
                  </Typography>
                  <Chip size="small" label={`${news?.total ?? 0} ${t('home.items', 'items')}`} />
                </Stack>

                {newsLoading ? (
                  <Grid container spacing={2}>
                    {[...Array(3)].map((_, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Skeleton variant="rounded" height={190} />
                      </Grid>
                    ))}
                  </Grid>
                ) : news?.data?.length ? (
                  <Grid container spacing={2}>
                    {news.data.map((item) => (
                      <Grid item xs={12} sm={4} key={item.blog.id}>
                        <BlogCard
                          title={item.blog.title}
                          summary={item.blog.bodyShort}
                          author={item.blog.author?.username}
                          image={item.blog.image}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyState label={t('home.noNews', 'There are no news items yet.')} />
                )}
              </Box>
            </GlassPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3} height="100%">
              <GlassPaper>
                <Box sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Icon icon="solar:ranking-star-broken" fontSize={24} />
                    <Typography variant="h6" fontWeight={800}>
                      {t('home.topRating', 'Top rating')}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 1.5 }} />
                  {topRatingLoading ? (
                    <Stack spacing={1}>
                      {[...Array(3)].map((_, index) => (
                        <Skeleton
                          key={index}
                          variant="rectangular"
                          height={52}
                          sx={{ borderRadius: 2 }}
                        />
                      ))}
                    </Stack>
                  ) : topRating?.data?.length ? (
                    topRating.data
                      .slice(0, 5)
                      .map((user, index) => (
                        <UserLine key={user.id || user.username} user={user} rank={index + 1} />
                      ))
                  ) : (
                    <EmptyState label={t('home.noTop', 'No rating data available.')} />
                  )}
                </Box>
              </GlassPaper>

              <GlassPaper>
                <Box sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      {t('home.systemUptime', 'System uptime')}
                    </Typography>
                    <Chip size="small" label={today.format('MMM YYYY')} />
                  </Stack>
                  <Typography variant="h2" fontWeight={800} mt={1}>
                    {uptimeDays} {t('home.days', 'days')}
                  </Typography>
                  <Typography color="text.secondary" mt={0.5}>
                    {t('home.since', 'Online since July 7, 2021')}
                  </Typography>
                </Box>
              </GlassPaper>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <GlassPaper>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('home.featuredPosts', 'Featured posts')}
                  </Typography>
                  <Chip size="small" label={`${posts?.total ?? 0} ${t('home.items', 'items')}`} />
                </Stack>
                {postsLoading ? (
                  <Stack spacing={1.5}>
                    {[...Array(3)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        height={88}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                ) : posts?.data?.length ? (
                  <Stack spacing={1.5}>
                    {posts.data.slice(0, 6).map((post) => (
                      <Stack
                        key={post.id}
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        spacing={2}
                        p={1.5}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2.5,
                          transition: 'all 150ms ease',
                          '&:hover': { boxShadow: 3, borderColor: 'primary.light' },
                        }}
                      >
                        <Avatar
                          src={post.author?.avatar}
                          alt={post.author?.username}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {post.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {post.bodyShort || t('home.readMore', 'Tap to read the full update')}
                          </Typography>
                        </Box>
                        <Chip label={`❤ ${formatNumber(post.likesCount)}`} size="small" />
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState label={t('home.noPosts', 'Blog posts will appear here soon.')} />
                )}
              </Box>
            </GlassPaper>
          </Grid>

          <Grid item xs={12} md={5}>
            <GlassPaper>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Icon icon="solar:calendar-line-duotone" fontSize={24} />
                  <Typography variant="h6" fontWeight={800}>
                    {t('home.birthdays', 'Upcoming birthdays')}
                  </Typography>
                </Stack>
                {birthdaysLoading ? (
                  <Stack spacing={1}>
                    {[...Array(4)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        height={64}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                ) : birthdays?.data?.length ? (
                  <Stack spacing={1}>
                    {birthdays.data.map((user) => (
                      <Stack
                        key={user.id || user.username}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        p={1.5}
                        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                      >
                        <Avatar src={user.avatar} alt={user.username} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {user.firstName
                              ? `${user.firstName} ${user.lastName || ''}`.trim()
                              : user.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                        {user.lastSeen && (
                          <Chip
                            size="small"
                            label={dayjs(user.lastSeen).format('MMM D')}
                            sx={{ bgcolor: 'primary.light', color: 'primary.main' }}
                          />
                        )}
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState label={t('home.noBirthdays', 'No birthdays in the queue.')} />
                )}
              </Box>
            </GlassPaper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Home;
