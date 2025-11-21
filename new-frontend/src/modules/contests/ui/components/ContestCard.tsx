import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, Card, CardActionArea, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { Contest } from '../../domain/entities/contest.entity';

dayjs.extend(relativeTime);

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();

  const startTime = contest.startTime ? dayjs(contest.startTime) : null;
  const finishTime = contest.finishTime ? dayjs(contest.finishTime) : null;

  const statusLabel = (() => {
    if (finishTime && finishTime.isBefore(dayjs())) {
      return t('contests.status.finished');
    }

    if (startTime && startTime.isAfter(dayjs())) {
      return t('contests.status.starts', { time: startTime.fromNow() });
    }

    if (finishTime) {
      return t('contests.status.ends', { time: finishTime.fromNow() });
    }

    return t('contests.status.active');
  })();

  const scheduleLabel = startTime
    ? t('contests.schedule', {
        start: startTime.format('DD MMM, HH:mm'),
        end: finishTime ? finishTime.format('DD MMM, HH:mm') : '',
      })
    : t('contests.noSchedule');

  return (
    <Card
      variant="outlined"
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Contest, contest.id)}
        sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 800,
              }}
              src={contest.logo ?? undefined}
              alt={contest.title}
            >
              {!contest.logo ? contest.title?.charAt(0) ?? 'C' : null}
            </Avatar>

            <Stack spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {contest.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {scheduleLabel}
              </Typography>
            </Stack>

            <Chip
              size="small"
              label={contest.categoryTitle || t('contests.labels.uncategorized')}
              variant="outlined"
            />
          </Stack>

          {contest.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                maxHeight: 96,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 4,
              }}
              dangerouslySetInnerHTML={{ __html: contest.description }}
            />
          ) : null}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" color="primary" label={statusLabel} />
            {contest.type ? <Chip size="small" variant="outlined" label={contest.type} /> : null}
            <Chip
              size="small"
              variant={contest.isRated ? 'filled' : 'outlined'}
              color={contest.isRated ? 'secondary' : 'default'}
              label={contest.isRated ? t('contests.labels.rated') : t('contests.labels.unrated')}
            />
          </Stack>

          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
            <StatItem
              icon="mdi:account-group"
              label={t('contests.participants', { count: contest.contestantsCount ?? 0 })}
            />
            <StatItem
              icon="mdi:account-plus"
              label={t('contests.registrants', { count: contest.registrantsCount ?? 0 })}
            />
            <StatItem icon="mdi:code-braces" label={t('contests.problems', { count: contest.problemsCount ?? 0 })} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

interface StatItemProps {
  icon: string;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <IconifyIcon icon={icon} width={18} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

export default ContestCard;
