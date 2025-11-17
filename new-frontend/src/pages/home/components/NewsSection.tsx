import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useHomeNews } from '../hooks';

const formatTags = (tags: any) => {
  if (!tags) return [] as string[];
  if (Array.isArray(tags)) return tags as string[];
  return `${tags}`
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const NewsSection = () => {
  const { data, isLoading } = useHomeNews();
  const newsItems = data?.data ?? [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Latest news
      </Typography>
      <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
        {(isLoading ? Array.from({ length: 3 }) : newsItems).map((item: any, index) => {
          const blog = item?.blog ?? item;
          const tags = formatTags(blog?.tags);
          return (
            <Grid key={blog?.id ?? index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={180} />
                ) : (
                  <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 180,
                        backgroundSize: 'cover',
                        backgroundImage: `url(${blog?.image || ''})`,
                        position: 'relative',
                      }}
                    />
                    <CardContent sx={{ width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
                        {blog?.title}
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      px={2}
                      pb={2}
                      color="text.secondary"
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconifyIcon icon="solar:chat-round-line-duotone" width={18} height={18} />
                        <Typography variant="caption">{blog?.commentsCount ?? 0}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconifyIcon icon="solar:heart-line-duotone" width={18} height={18} />
                        <Typography variant="caption">{blog?.likesCount ?? 0}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconifyIcon icon="solar:eye-line-duotone" width={18} height={18} />
                        <Typography variant="caption">{blog?.views ?? 0}</Typography>
                      </Stack>
                    </Stack>
                  </CardActionArea>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default NewsSection;
