import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useUserAchievements, useUserCompetitionPrizes } from '../../../application/queries';
import {
  UserAchievement,
  UserCompetitionPrize,
} from '../../../domain/entities/user-profile.entity';

type FilterKey = 'completed' | 'notCompleted' | 'all';

const filterAchievements = (achievements: UserAchievement[], filter: FilterKey) => {
  if (filter === 'completed') {
    return achievements.filter((item) => item.userResult?.done);
  }
  if (filter === 'notCompleted') {
    return achievements.filter((item) => !item.userResult?.done);
  }
  return achievements;
};

const formatPrize = (prize: UserCompetitionPrize) => {
  if (prize.prizeType === 'MONEY') {
    return prize.moneyValue ? `${prize.moneyValue} ${prize.currency}` : prize.currency;
  }
  if (prize.prizeType === 'KEPCOIN') {
    return `${prize.kepcoinValue ?? 0} Kepcoin`;
  }
  if (prize.prizeType === 'TELEGRAM_PREMIUM') {
    return `${prize.telegramPremiumPeriod ?? 0} mo Telegram`;
  }
  return prize.note || prize.prizeTitle;
};

const UserProfileAchievementsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const [filter, setFilter] = useState<FilterKey>('completed');

  const { data: achievements, isLoading } = useUserAchievements(username);
  const { data: prizes, isLoading: isPrizesLoading } = useUserCompetitionPrizes(username);

  const filtered = useMemo(
    () => filterAchievements(achievements ?? [], filter),
    [achievements, filter],
  );

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.achievements.title')}
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={(_, value) => value && setFilter(value)}
              >
                <ToggleButton value="completed">
                  {t('users.profile.achievements.completed')}
                </ToggleButton>
                <ToggleButton value="notCompleted">
                  {t('users.profile.achievements.notCompleted')}
                </ToggleButton>
                <ToggleButton value="all">{t('users.profile.achievements.all')}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {isLoading ? (
              <Grid container spacing={2}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Skeleton variant="rectangular" height={120} />
                  </Grid>
                ))}
              </Grid>
            ) : filtered.length ? (
              <Grid container spacing={2}>
                {filtered.map((item) => {
                  const progress =
                    item.totalProgress && item.userResult
                      ? Math.min(
                          100,
                          Math.round(((item.userResult.progress ?? 0) / item.totalProgress) * 100),
                        )
                      : 0;
                  return (
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack direction="column" spacing={1}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                {item.userResult?.progress ?? 0}/{item.totalProgress}
                              </Typography>
                              <Chip
                                size="small"
                                color={item.userResult?.done ? 'success' : 'default'}
                                label={
                                  item.userResult?.done
                                    ? t('users.profile.achievements.completed')
                                    : t('users.profile.achievements.notCompleted')
                                }
                              />
                            </Stack>
                            <LinearProgress variant="determinate" value={progress} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('users.profile.achievements.empty')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              {t('users.profile.prizes.title')}
            </Typography>

            {isPrizesLoading ? (
              <Skeleton variant="rectangular" height={100} />
            ) : prizes?.length ? (
              <Grid container spacing={1.5}>
                {prizes.map((prize) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack direction="column" spacing={0.75}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {prize.prizeTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {prize.competitionTitle}
                          </Typography>
                          <Chip label={prize.competitionType} size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {formatPrize(prize)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('users.profile.prizes.empty')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserProfileAchievementsTab;
