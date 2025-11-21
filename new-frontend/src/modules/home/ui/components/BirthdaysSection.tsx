import { Avatar, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover';
import { useNextBirthdays } from '../../application/queries';
import type { HomeNextBirthdays } from '../../domain/entities/home.entity';

type BirthdayUser = HomeNextBirthdays['data'][number] & { date?: string };

const BirthdaysSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useNextBirthdays();

  const birthdays = (data?.data ?? []) as BirthdayUser[];

  const renderSkeletons = () =>
    Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} variant="rounded" height={72} />);

  return (
    <Paper background={2} sx={{ p: 3, height: '100%' }}>
      <Stack spacing={2} direction="column">
        <Typography variant="h5" fontWeight={600}>
          {t('homePage.birthdays.title')}
        </Typography>

        {isLoading ? (
          renderSkeletons()
        ) : birthdays.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.birthdays.empty')}
          </Typography>
        ) : (
          <Stack spacing={2} direction="column">
            {birthdays.map((birthday) => {
              const fullName = [birthday.firstName, birthday.lastName].filter(Boolean).join(' ');
              const displayDate = birthday.date ? dayjs(birthday.date).format('MMM DD, YYYY') : null;

              return (
                <Stack key={birthday.username} direction="row" spacing={2} alignItems="center">
                  <Avatar src={birthday.avatar} alt={birthday.username} sx={{ width: 48, height: 48 }} />

                  <Stack spacing={0.5} minWidth={0} direction="column">
                    <UserPopover username={birthday.username} fullName={fullName} avatar={birthday.avatar}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {fullName || birthday.username}
                      </Typography>
                    </UserPopover>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      @{birthday.username}
                    </Typography>

                    {displayDate && (
                      <Typography variant="body2" color="text.secondary">
                        {displayDate}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default BirthdaysSection;
