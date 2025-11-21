import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router';
import { Avatar, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BlogCard from 'modules/blog/ui/components/BlogCard';
import type { BlogPost } from 'modules/blog/domain/entities/blog.entity';
import { getResourceById, resources } from 'app/routes/resources';
import { useHomeNews } from '../../application/queries';
import type { HomeNewsList } from '../../domain/entities/home.entity';
import KepIcon from 'shared/components/base/KepIcon';

import 'swiper/css';
import 'swiper/css/pagination';

type NewsItem = HomeNewsList['data'][number];

const mapTags = (tags?: string | string[] | null): string[] => {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const mapNewsToPost = (news: NewsItem): BlogPost => ({
  id: Number(news.blog.id ?? 0),
  author: {
    username: news.blog.author.username,
    avatar: news.blog.author.avatar,
  },
  title: news.blog.title,
  bodyShort: news.blog.bodyShort ?? undefined,
  image: news.blog.image ?? null,
  views: news.blog.views ?? 0,
  likesCount: news.blog.likesCount ?? 0,
  commentsCount: news.blog.commentsCount ?? 0,
  tags: mapTags(news.blog.tags),
  created: news.blog.created,
});

const NewsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomeNews();

  const newsPosts = useMemo(() => data?.data?.map(mapNewsToPost) ?? [], [data]);

  return (
    <Paper sx={{ p: 4, height: '100%' }}>
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <KepIcon name="blog" fontSize={24} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('homePage.news.title')}
          </Typography>
        </Stack>

        <Divider />

        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={220} />
            <Stack spacing={1}>
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="50%" />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="30%" />
            </Stack>
          </Stack>
        ) : newsPosts.length ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            loop
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            style={{ width: '100%', paddingBottom: 16 }}
          >
            {newsPosts.map((post) => {
              const blogUrl = getResourceById(resources.BlogPost, post.id);

              return (
                <SwiperSlide key={post.id} style={{ height: '100%' }}>
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <BlogCard post={post} />

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={post.author.avatar} alt={post.author.username} />
                      <Stack spacing={0.25}>
                        <Typography component={RouterLink} to={blogUrl} variant="subtitle2" color="text.primary">
                          {post.author.username}
                        </Typography>
                        {post.created ? (
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(post.created).format('D MMM YYYY')}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Stack>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('homePage.news.empty')}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default NewsSection;
