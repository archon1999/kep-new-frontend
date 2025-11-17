import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useHomePosts } from '../hooks';

const formatTags = (tags: any) => {
  if (!tags) return [] as string[];
  if (Array.isArray(tags)) return tags as string[];
  return `${tags}`
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const PostsSection = () => {
  const { data, isLoading } = useHomePosts();
  const posts = data?.data ?? [];

  const items = isLoading ? Array.from({ length: 4 }) : posts;

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Latest posts
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: { xs: '100%', sm: '48%', md: '32%' },
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            pr: 1,
          }}
        >
          {items.map((post: any, index) => {
            const blog = post?.blog ?? post;
            const tags = formatTags(blog?.tags);
            return (
              <Card key={blog?.id ?? index} sx={{ borderRadius: 3, minWidth: 0 }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={180} />
                ) : (
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="180"
                      image={blog?.image || ''}
                      alt={blog?.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={blog?.author?.avatar}
                            alt={blog?.author?.username}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Stack spacing={0}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {blog?.author?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {blog?.created}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction="row" spacing={1} color="text.secondary">
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconifyIcon
                              icon="solar:chat-round-line-duotone"
                              width={16}
                              height={16}
                            />
                            <Typography variant="caption">{blog?.commentsCount ?? 0}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconifyIcon icon="solar:heart-line-duotone" width={16} height={16} />
                            <Typography variant="caption">{blog?.likesCount ?? 0}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconifyIcon icon="solar:eye-line-duotone" width={16} height={16} />
                            <Typography variant="caption">{blog?.views ?? 0}</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {blog?.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {blog?.bodyShort}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.5}>
                        {tags.map((tag) => (
                          <Box
                            key={tag}
                            px={1}
                            py={0.5}
                            borderRadius={1}
                            bgcolor="action.hover"
                            color="text.secondary"
                            fontSize={12}
                          >
                            {tag}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                )}
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostsSection;
