import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Card, CardActionArea, Chip, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useHomeNews } from '../../application/queries';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import type { BlogPost } from '../../../blog/domain/entities/blog.entity';
import { blogMappers } from '../../../blog/data-access/mappers/blog.mapper';

const SKELETON_ITEMS = Array.from({ length: 3 });

const NewsStat = ({
  icon,
  value,
  label,
}: {
  icon: Parameters<typeof KepIcon>[0]['name'];
  value: number;
  label: string;
}) => (
  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
    <KepIcon name={icon} fontSize={18} />
    <Typography variant="caption" fontWeight={700} color="text.primary">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const NewsSkeleton = () => (
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
    <Skeleton variant="rectangular" width={{ xs: '100%', md: 260 }} height={220} sx={{ borderRadius: 3 }} />

    <Stack spacing={1.5} sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="65%" />

      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={60} height={28} />
        <Skeleton variant="rounded" width={80} height={28} />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Skeleton variant="text" width={90} />
        <Skeleton variant="text" width={90} />
        <Skeleton variant="text" width={90} />
      </Stack>
    </Stack>
  </Stack>
);

const NewsSlideCard = ({ post }: { post: BlogPost }) => {
  const { t } = useTranslation();
  const blogUrl = getResourceById(resources.BlogPost, post.id);

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <CardActionArea
        component={RouterLink}
        to={blogUrl}
        sx={{ display: 'flex', alignItems: 'stretch', flexDirection: { xs: 'column', md: 'row' } }}
      >
        {post.image ? (
          <Box
            component="img"
            src={post.image}
            alt={post.title}
            sx={{
              width: { xs: '100%', md: 260 },
              height: { xs: 200, md: 'auto' },
              objectFit: 'cover',
              alignSelf: 'stretch',
            }}
          />
        ) : (
          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              minHeight: 200,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KepIcon name="news" fontSize={32} color="grey.500" />
          </Box>
        )}

        <Stack spacing={2} sx={{ p: { xs: 3, md: 4 }, flex: 1, textAlign: 'left' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={post.author.avatar} alt={post.author.username} />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                {post.author.username}
              </Typography>
              {post.created ? (
                <Typography variant="caption" color="text.secondary">
                  {dayjs(post.created).format('D MMM YYYY')}
                </Typography>
              ) : null}
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 800 }}>
              {post.title}
            </Typography>

            {post.bodyShort ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: post.bodyShort }}
              />
            ) : null}

            {post.tags.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {post.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                ))}
              </Stack>
            ) : null}

            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <NewsStat icon="comment" value={post.commentsCount} label={t('blog.comments')} />
                <NewsStat icon="like" value={post.likesCount} label={t('blog.likes')} />
                <NewsStat icon="view" value={post.views} label={t('blog.views')} />
              </Stack>

              <Typography
                variant="body2"
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}
              >
                {t('blog.readMore')}
                <KepIcon name="arrow-forward" fontSize={18} />
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

const NewsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomeNews();

  const newsItems = useMemo<BlogPost[]>(() => {
    if (!data?.data?.length) {
      return [];
    }

    return data.data.map((item) => blogMappers.mapBlogListItem(item.blog));
  }, [data]);

  return (
    <Paper sx={{ p: 4, height: '100%' }}>
      <Stack spacing={3} direction="column" sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <KepIcon name="news" fontSize={24} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('homePage.news.title')}
          </Typography>
        </Stack>

        <Divider />

        {isLoading ? (
          <Stack spacing={2}>
            {SKELETON_ITEMS.map((_, index) => (
              <NewsSkeleton key={index} />
            ))}
          </Stack>
        ) : newsItems.length ? (
          <Box sx={{
            '.swiper': {
              pb: 3,
            },
            '.swiper-pagination-bullet': {
              bgcolor: 'text.disabled',
              opacity: 1,
            },
            '.swiper-pagination-bullet-active': {
              bgcolor: 'primary.main',
            },
          }}>
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              loop
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
            >
              {newsItems.map((post) => (
                <SwiperSlide key={post.id}>
                  <NewsSlideCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.news.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default NewsSection;
