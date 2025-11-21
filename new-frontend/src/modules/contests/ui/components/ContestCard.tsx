import dayjs from 'dayjs';
import { alpha } from '@mui/material/styles';
import { Box, Button, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { ContestListItem } from '../../domain/entities/contest.entity';

interface ContestCardProps {
  contest: ContestListItem;
}

const getStatusLabel = (status: number | string | undefined, translate: (key: string) => string) => {
  const numericStatus = typeof status === 'string' ? Number(status) : status;
  if (numericStatus === 1) {
    return { label: translate('contests.status.finished'), color: 'default' as const };
  }

  if (numericStatus === -1) {
    return { label: translate('contests.status.upcoming'), color: 'info' as const };
  }

  return { label: translate('contests.status.ongoing'), color: 'primary' as const };
};

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();
  const startDate = contest.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest.finishTime ? dayjs(contest.finishTime) : null;

  const status = getStatusLabel(contest.status, t);

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: 3,
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(86,112,255,0.08), rgba(86,112,255,0))',
        },
      }}
    >
      {contest.logo ? (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${contest.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            filter: 'grayscale(1)',
            transform: 'scale(1.05)',
          }}
        />
      ) : null}

      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Contest, contest.id)}
        sx={{ position: 'relative', zIndex: 1, display: 'block' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={1}>
            <Stack direction="column" spacing={0.5} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
                <Chip label={status.label} color={status.color} size="small" />
                {contest.categoryTitle ? <Chip label={contest.categoryTitle} size="small" variant="outlined" /> : null}
                {contest.isRated ? (
                  <Chip label={t('contests.rated')} color="secondary" size="small" sx={{ bgcolor: alpha('#6E56CF', 0.1) }} />
                ) : null}
                {contest.userInfo?.isRegistered ? (
                  <Chip label={t('contests.registered')} color="success" size="small" variant="outlined" />
                ) : null}
              </Stack>

              <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }} noWrap>
                {contest.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {t('contests.starts', { value: startDate ? startDate.format('DD MMM, HH:mm') : '—' })}
              </Typography>
            </Stack>

            <Chip label={contest.type} size="small" variant="outlined" />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="calendar" fontSize={18} />
              <Typography variant="body2" color="text.secondary">
                {t('contests.ends', { value: finishDate ? finishDate.format('DD MMM, HH:mm') : '—' })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <KepIcon name="contest" fontSize={18} />
                <Typography variant="body2" color="text.secondary">
                  {t('contests.participants', { count: contest.contestantsCount || contest.registrantsCount })}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <KepIcon name="problem" fontSize={18} />
                <Typography variant="body2" color="text.secondary">
                  {t('contests.problems', { count: contest.problemsCount })}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="users" fontSize={18} />
              <Typography variant="body2" color="text.secondary">
                {contest.categoryTitle}
              </Typography>
            </Stack>

            <Button variant="contained" color="primary" size="small" endIcon={<KepIcon name="arrow-right" fontSize={18} />}>
              {t('contests.view')}
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContestCard;
