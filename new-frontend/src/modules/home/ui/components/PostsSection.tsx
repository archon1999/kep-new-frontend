import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import BlogCard from 'modules/blog/ui/components/BlogCard';
import { mapBlogPost } from 'modules/blog/data-access/mappers/blog.mapper.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';
import { useHomePosts } from '../../application/queries';
import { SwiperNavigation } from './NewsSection.tsx';
import { BlogDetail } from 'shared/api/orval/generated/endpoints/index.schemas.ts';

const PostsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHomePosts();

  const posts = useMemo(
    () =>
      data?.data?.map((item) =>
        mapBlogPost({
          ...(item as BlogDetail),
          body: item.bodyShort ?? '',
        }),
      ) ?? [],
    [data],
  );

  return (
    <Paper sx={{ height: '100%' }}>
      <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('homePage.posts.title')}
        </Typography>

        {isLoading ? (
          <Stack direction="row" spacing={2} sx={{ width: 1, overflow: 'hidden' }}>
            {Array.from({ length: 1 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={360} sx={{ flex: 1, minWidth: 240 }} />
            ))}
          </Stack>
        ) : posts.length ? (
          <Box sx={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={16}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              breakpoints={{
              }}
            >
              <SwiperNavigation />
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <Box sx={{ height: 1 }}>
                    <BlogCard post={post} />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.posts.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default PostsSection;
