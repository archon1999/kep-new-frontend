import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';
import { useNextBirthdays } from '../../application/queries';
import type { HomeNextBirthdays } from '../../domain/entities/home.entity';


const SKELETON_ITEMS = Array.from({ length: 5 });

type NextBirthdayUser = (HomeNextBirthdays['data'] extends Array<infer Item> ? Item : never) & {
  date?: string;
  birthday?: string;
};

const getDisplayName = (user: NextBirthdayUser) => {
  const firstName = user.firstName?.trim() ?? '';
  const lastName = user.lastName?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || user.username;
};

const BirthdaysSection = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useNextBirthdays();

  const birthdays = useMemo(() => {
    if (Array.isArray((data as HomeNextBirthdays)?.data)) {
      return (data as HomeNextBirthdays).data as NextBirthdayUser[];
    }

    if (Array.isArray(data as unknown as unknown[])) {
      return data as unknown as NextBirthdayUser[];
    }

    return undefined;
  }, [data]);

  const formatBirthdayDate = useMemo(
    () =>
      (birthday?: string) => {
        if (!birthday) {
          return t('homePage.birthdays.dateUnknown');
        }

        const parsed = dayjs(birthday);

        if (!parsed.isValid()) {
          return t('homePage.birthdays.dateUnknown');
        }

        return parsed.locale(i18n.language).format('MMMM D');
      },
    [i18n.language, t],
  );

  return (
    <Paper sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column" sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('homePage.birthdays.title')}
          </Typography>
        </Stack>

        {isLoading ? (
          <Stack spacing={2.5}>
            {SKELETON_ITEMS.map((_, index) => (
              <Stack key={index} direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={48} height={48} />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="45%" />
                  <Skeleton variant="text" width="30%" />
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : birthdays?.length ? (
          <Stack direction="column" spacing={1.5}>
            {birthdays.map((user) => {
              const displayName = getDisplayName(user);
              const birthdayDate = formatBirthdayDate(user.birthday ?? user.date);
              const profilePath = getResourceByUsername(resources.UserProfile, user.username);

              return (
                <Card>
                  <CardContent>
                    <Stack key={user.username} direction="row" spacing={2} alignItems="center">
                      <Avatar src={user.avatar} alt={displayName} sx={{ width: 48, height: 48 }} />

                      <Stack direction="column" spacing={0.5} sx={{ flex: 1 }}>
                        <Link
                          component={RouterLink}
                          to={profilePath}
                          underline="hover"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {displayName}
                        </Link>
                        <Typography variant="body2" color="text.secondary">
                          {birthdayDate}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.birthdays.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default BirthdaysSection;
