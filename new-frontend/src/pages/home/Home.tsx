import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useThemeMode } from 'shared/hooks/useThemeMode';

interface RankCardConfig {
  key: string;
  label: string;
  value: number;
  rank: number;
  percentile: number;
  icon: string;
}

interface NewsCardConfig {
  title: string;
  excerpt: string;
  date: string;
}

interface UserPreview {
  username: string;
  avatar: string;
  streak: number;
}

interface PostPreview {
  title: string;
  excerpt: string;
  image: string;
  tag: string;
}

const RANK_CARDS: RankCardConfig[] = [
  {
    key: 'skills',
    label: 'skills_rating',
    value: 67.2,
    rank: 13,
    percentile: 98.2,
    icon: 'material-symbols:data-exploration-outline-rounded',
  },
  {
    key: 'activity',
    label: 'activity_rating',
    value: 22.2,
    rank: 22,
    percentile: 96.4,
    icon: 'material-symbols:library-add-check-outline-rounded',
  },
  {
    key: 'contests',
    label: 'contests_rating',
    value: 2080,
    rank: 9,
    percentile: 99.1,
    icon: 'material-symbols:military-tech-rounded',
  },
  {
    key: 'challenges',
    label: 'challenges_rating',
    value: 1792,
    rank: 19,
    percentile: 95.7,
    icon: 'material-symbols:psychology-alt-outline-rounded',
  },
];

const NEWS: NewsCardConfig[] = [
  {
    title: 'KEP.uz platformasi yangi mavsumni boshladi',
    excerpt:
      'Yangi o‘quv rejasi va qo‘shilgan laboratoriyalar yordamida endi har bir foydalanuvchi o‘z yo‘lini tezroq topishi mumkin.',
    date: '2025-02-01',
  },
  {
    title: 'Algoritmlar bo‘yicha haftalik chellenj qaytdi',
    excerpt:
      'Har seshanba kuni beriladigan vazifalar uchun rating tizimi yangilandi va qo‘shimcha sovrinlar qo‘shildi.',
    date: '2025-02-05',
  },
  {
    title: 'Yangi kontent: konkurs va tajriba almashish',
    excerpt:
      'Jamoa yig‘ilishlaridan olingan eng yaxshi tajribalar va musobaqa tavsiyalari blog bo‘limida e’lon qilindi.',
    date: '2025-02-10',
  },
];

const TOP_USERS: UserPreview[] = [
  {
    username: 'nurbek.dev',
    avatar: 'https://i.pravatar.cc/150?img=3',
    streak: 164,
  },
  {
    username: 'aziza',
    avatar: 'https://i.pravatar.cc/150?img=15',
    streak: 142,
  },
  {
    username: 'coder_m',
    avatar: 'https://i.pravatar.cc/150?img=30',
    streak: 121,
  },
];

const ONLINE_USERS: UserPreview[] = [
  {
    username: 'olimjon',
    avatar: 'https://i.pravatar.cc/150?img=45',
    streak: 0,
  },
  {
    username: 'tanya',
    avatar: 'https://i.pravatar.cc/150?img=47',
    streak: 0,
  },
  {
    username: 'hasan',
    avatar: 'https://i.pravatar.cc/150?img=51',
    streak: 0,
  },
  {
    username: 'lola',
    avatar: 'https://i.pravatar.cc/150?img=61',
    streak: 0,
  },
  {
    username: 'samandar',
    avatar: 'https://i.pravatar.cc/150?img=65',
    streak: 0,
  },
];

const POSTS: PostPreview[] = [
  {
    title: 'React bilan real vaqtli grafiklar',
    excerpt:
      'WebSocket va custom hook yordamida MUI asosida real vaqtli dashboard yasash bo‘yicha qadamlar.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    tag: 'Frontend',
  },
  {
    title: 'Algoritmlar marafoni yakunlari',
    excerpt:
      'Eng tezkor yechimlar, dasturlash tillari bo‘yicha statistika va qatnashchilarning fikrlari.',
    image:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=80',
    tag: 'Challange',
  },
  {
    title: 'Backend optimizatsiyasi uchun 5 maslahat',
    excerpt:
      'Kesh, fon jarayonlari va monitoring vositalari bilan samaradorlikni oshirish bo‘yicha tajriba.',
    image:
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80',
    tag: 'Backend',
  },
  {
    title: 'UI/UX yangiliklari',
    excerpt:
      'Yangi rang palitralari, tipografiya va animatsiyalar orqali foydalanuvchi tajribasini yaxshilash.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    tag: 'Design',
  },
];

const SYSTEM_START = '2021-07-07';
const USERS_CHART_POINTS = [
  12, 18, 24, 30, 45, 52, 64, 71, 68, 74, 90, 102, 117, 124, 132, 148, 161, 170, 188,
];

const RankCard = ({ config, hint }: { config: RankCardConfig; hint: string }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: 6,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(95,99,255,0.15) 0%, rgba(0,140,255,0.2) 100%)',
        }}
      />
      <Box sx={{ position: 'relative', p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: theme.palette.primary.main, color: 'primary.contrastText' }}>
              <Icon icon={config.icon} width={24} />
            </Avatar>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {t(config.label)}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {config.value}
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title={hint} arrow>
            <Icon
              icon="material-symbols:info-outline-rounded"
              color={theme.palette.text.secondary}
              width={22}
            />
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
          <Chip
            size="small"
            color="primary"
            label={`#${config.rank}`}
            sx={{ color: theme.palette.primary.contrastText, fontWeight: 700 }}
          />
          <Typography variant="body2" color="text.secondary">
            {t('home_percentile_hint', { percentile: config.percentile })}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
};

const NewsCard = ({ news }: { news: NewsCardConfig }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {dayjs(news.date).format('MMM D, YYYY')}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {news.excerpt}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
          <Typography fontWeight={600}>{t('read_more')}</Typography>
          <Icon
            icon="material-symbols:arrow-forward-rounded"
            width={18}
            color={theme.palette.primary.main}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const TopRatingCard = ({ users }: { users: UserPreview[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('top_rating')}
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {users.map((user, index) => (
            <Stack key={user.username} direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={user.avatar}
                alt={user.username}
                sx={{
                  border: `2px solid ${theme.palette.primary.light}`,
                  width: 40,
                  height: 40,
                }}
              />
              <Stack spacing={0.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {user.username}
                  </Typography>
                  <Chip
                    size="small"
                    color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                    label={`#${index + 1}`}
                    sx={{
                      color:
                        index === 0
                          ? theme.palette.primary.contrastText
                          : index === 1
                            ? theme.palette.secondary.contrastText
                            : 'text.primary',
                    }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t('streak_days', { count: user.streak })}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const SystemCard = ({ today }: { today: dayjs.Dayjs }) => {
  const { t } = useTranslation();
  const daysRunning = today.diff(dayjs(SYSTEM_START), 'day');

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Icon icon="material-symbols:calendar-today-outline" width={24} />
          </Avatar>
          <Stack spacing={0.25}>
            <Typography variant="subtitle2" color="text.secondary">
              {today.format('dddd, D MMMM')}
            </Typography>
            <Typography variant="h6">{t('system')}</Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            textAlign: 'center',
            mt: 3,
            py: 2,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            {daysRunning}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('day')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Sparkline = ({ points }: { points: number[] }) => {
  const theme = useTheme();
  const width = 240;
  const height = 120;

  const path = useMemo(() => {
    if (points.length === 0) return '';
    const max = Math.max(...points);
    const min = Math.min(...points);
    const diff = max - min || 1;
    const stepX = width / Math.max(points.length - 1, 1);

    const coords = points.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / diff) * height;
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  }, [points]);

  return (
    <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width: '100%' }}>
      <path
        d={path}
        fill="none"
        stroke={theme.palette.primary.main}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
};

const UsersChartCard = ({ total, points }: { total: number; points: number[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('users')}
            </Typography>
          </Stack>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Icon icon="material-symbols:group-rounded" width={22} />
          </Avatar>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Sparkline points={points} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <AvatarGroup
            max={6}
            sx={{
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            {ONLINE_USERS.map((user) => (
              <Avatar key={user.username} alt={user.username} src={user.avatar} />
            ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary">
            {t('online_users', { count: ONLINE_USERS.length })}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

const BirthdaysCard = ({ users }: { users: UserPreview[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('birthdays')}
        </Typography>
        <Stack spacing={2}>
          {users.map((user) => (
            <Stack key={user.username} direction="row" spacing={1.5} alignItems="center">
              <Avatar src={user.avatar} alt={user.username} />
              <Stack spacing={0.25}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user.username}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                  <Icon icon="material-symbols:cake-rounded" width={18} />
                  <Typography variant="body2">{dayjs().add(3, 'day').format('MMM D')}</Typography>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const PostsCarousel = ({ posts }: { posts: PostPreview[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">{t('recent_posts')}</Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            color="primary.main"
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="body2" fontWeight={700}>
              {t('view_all_posts')}
            </Typography>
            <Icon
              icon="material-symbols:arrow-forward-rounded"
              width={18}
              color={theme.palette.primary.main}
            />
          </Stack>
        </Stack>

        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
          {posts.map((post) => (
            <Card
              key={post.title}
              sx={{
                minWidth: { xs: 260, sm: 300, md: 320 },
                borderRadius: 3,
                boxShadow: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: 180,
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent>
                <Chip label={post.tag} size="small" color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.excerpt}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const today = dayjs();

  const onlineTotal = USERS_CHART_POINTS[USERS_CHART_POINTS.length - 1];

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: 4,
        color: isDark ? 'grey.100' : 'text.primary',
      }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 6,
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(56,189,248,0.15) 100%)',
          }}
        >
          <Typography variant="overline" color="text.secondary">
            KEP.UZ
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
            {t('home_welcome_message', { name: 'Azizbek' })}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('home_subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Grid container spacing={2.5}>
              {RANK_CARDS.map((rank) => (
                <Grid item xs={12} sm={6} md={3} key={rank.key}>
                  <RankCard config={rank} hint={t('home_rank_hint')} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="h5" fontWeight={800}>
                {t('latest_news')}
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {NEWS.map((news) => (
                <Grid item xs={12} md={4} key={news.title}>
                  <NewsCard news={news} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <TopRatingCard users={TOP_USERS} />
              </Grid>
              <Grid item xs={12} md={4}>
                <SystemCard today={today} />
              </Grid>
              <Grid item xs={12} md={4}>
                <UsersChartCard total={onlineTotal} points={USERS_CHART_POINTS} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} lg={3}>
                <BirthdaysCard users={TOP_USERS} />
              </Grid>
              <Grid item xs={12} lg={9}>
                <PostsCarousel posts={POSTS} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Home;
