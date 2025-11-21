import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { Contest } from '../../domain/entities/contest.entity';

dayjs.extend(relativeTime);

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();

  const startTime = contest.startTime ? dayjs(contest.startTime) : null;
  const finishTime = contest.finishTime ? dayjs(contest.finishTime) : null;
  const now = dayjs();

  const statusLabel = (() => {
    if (finishTime && finishTime.isBefore(now)) {
      return t('contests.finished');
    }

    if (startTime && startTime.isAfter(now)) {
      return `${t('contests.startsIn')} ${startTime.fromNow()}`.trim();
    }

    if (finishTime) {
      return `${t('contests.endsIn')} ${finishTime.fromNow()}`;
    }

    return t('contests.active');
  })();

  const scheduleLabel = startTime && finishTime
    ? `${startTime.format('DD MMM, HH:mm')} · ${finishTime.format('DD MMM, HH:mm')}`
    : startTime
      ? startTime.format('DD MMM, HH:mm')
      : '';

  return (
    <Card
      variant="outlined"
      sx={{
        height: 1,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Contest, contest.id)}
        sx={{ height: 1, display: 'flex', alignItems: 'stretch' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}
              src={contest.logo || undefined}
            >
              {!contest.logo ? contest.title?.charAt(0) ?? 'C' : null}
            </Avatar>

            <Stack spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {contest.title}
              </Typography>
              {contest.categoryTitle ? (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {contest.categoryTitle}
                </Typography>
              ) : null}
            </Stack>

            <Chip
              label={contest.isRated ? t('contests.rated') : t('contests.unrated')}
              color={contest.isRated ? 'secondary' : 'default'}
              size="small"
            />
          </Stack>

          {contest.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {contest.description}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {contest.type ? <Chip label={contest.type} size="small" /> : null}
            {contest.categoryTitle ? <Chip label={contest.categoryTitle} size="small" variant="outlined" /> : null}
            {statusLabel ? (
              <Chip
                label={statusLabel}
                size="small"
                icon={<KepIcon name="info" width={18} />}
                sx={{ textTransform: 'none' }}
              />
            ) : null}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" divider={<Divider flexItem orientation="vertical" />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="challenge-time" width={20} />
              <Typography variant="body2" color="text.secondary">
                {scheduleLabel || '—'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="attempt" width={20} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.problemsCount', { count: contest.problemsCount ?? 0 })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="users" width={20} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.registrantsCount', { count: contest.registrantsCount ?? contest.contestantsCount ?? 0 })}
              </Typography>
            </Stack>
          </Stack>

          {contest.userInfo?.isRegistered ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'success.lighter', color: 'success.darker', px: 1.5, py: 0.5, borderRadius: 2 }}>
              <KepIcon name="verdict" width={18} />
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                {t('contests.registeredLabel')}
              </Typography>
            </Box>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContestCard;
