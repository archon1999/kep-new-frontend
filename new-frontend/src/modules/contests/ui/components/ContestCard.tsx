import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ContestListItem } from '../../domain/entities/contest.entity';

dayjs.extend(relativeTime);

interface ContestCardProps {
  contest: ContestListItem;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();

  const now = dayjs();
  const startTime = contest.startTime ? dayjs(contest.startTime) : null;
  const finishTime = contest.finishTime ? dayjs(contest.finishTime) : null;

  const isUpcoming = startTime ? startTime.isAfter(now) : false;
  const isFinished = finishTime ? finishTime.isBefore(now) : false;

  const timingLabel = (() => {
    if (isFinished) {
      return t('contests.finished');
    }

    if (isUpcoming && startTime) {
      return t('contests.startsIn', { time: startTime.from(now) });
    }

    if (finishTime) {
      return t('contests.endsIn', { time: finishTime.from(now) });
    }

    return t('contests.active');
  })();

  const participantCount = isUpcoming
    ? contest.registrantsCount ?? 0
    : contest.contestantsCount ?? contest.registrantsCount ?? 0;

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: 1,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {contest.logo ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${contest.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            filter: 'grayscale(0.1)',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 100%)',
          pointerEvents: 'none',
        }}
      />

      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Contest, contest.id)}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: 1 }}
      >
        <CardContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, height: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Chip label={contest.categoryTitle} color="default" />
            <Chip
              label={contest.isRated ? t('contests.rated') : t('contests.unrated')}
              color={contest.isRated ? 'success' : 'default'}
              variant={contest.isRated ? 'filled' : 'outlined'}
              size="small"
            />
          </Stack>

          <Stack direction="column" spacing={1}>
            <Typography variant="h6" fontWeight={800} sx={{ wordBreak: 'break-word' }}>
              {contest.title}
            </Typography>

            {contest.description ? (
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
                sx={{
                  maxHeight: 108,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  '& p': { m: 0 },
                }}
                dangerouslySetInnerHTML={{ __html: contest.description }}
              />
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={timingLabel}
              color={isFinished ? 'default' : isUpcoming ? 'info' : 'success'}
              size="small"
              variant={isFinished ? 'outlined' : 'filled'}
            />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:account-group" width={18} />
              <Typography variant="body2" color="text.secondary">
                {isUpcoming
                  ? t('contests.registrants', { count: participantCount })
                  : t('contests.contestants', { count: participantCount })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:checkbox-multiple-blank-circle-outline" width={18} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.problems', { count: contest.problemsCount ?? 0 })}
              </Typography>
            </Stack>

            {contest.type ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <IconifyIcon icon="mdi:medal-outline" width={18} />
                <Typography variant="body2" color="text.secondary">
                  {t('contests.typeLabel', { type: contest.type })}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContestCard;
