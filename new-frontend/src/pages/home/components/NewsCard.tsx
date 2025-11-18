import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import KepIcon from 'shared/components/base/KepIcon';
import { ApiNewsListResult } from 'shared/api/orval/generated/endpoints';

interface NewsCardProps {
  blog: ApiNewsListResult['data'][number]['blog'];
}

const NewsCard = ({ blog }: NewsCardProps) => {
  const tags = blog.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? [];

  return (
    <Card sx={{ height: 1 }}>
      <CardActionArea sx={{ height: 1 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            height: 320,
            display: 'flex',
            alignItems: 'flex-end',
            background: blog.image
              ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%), url(${blog.image})`
              : (theme) => `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Stack
            spacing={2}
            sx={{
              width: 1,
              p: 3,
              color: 'common.white',
              backdropFilter: blog.image ? 'blur(0px)' : 'none',
              background: blog.image ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)' : 'transparent',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                {blog.created ? dayjs(blog.created).format('MMM D, YYYY') : ''}
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ lineClamp: 2 }}>
                {blog.title}
              </Typography>
              {blog.bodyShort && (
                <Typography variant="body2" sx={{ lineClamp: 2, opacity: 0.9 }}>
                  {blog.bodyShort}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" color="primary" variant="soft" />
              ))}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'inherit' }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="rating" fontSize={18} />
                <Typography variant="body2">{blog.commentsCount}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="challenge" fontSize={18} />
                <Typography variant="body2">{blog.likesCount}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <KepIcon name="eye" fontSize={18} />
                <Typography variant="body2">{blog.views}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default NewsCard;
