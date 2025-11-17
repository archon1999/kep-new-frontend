import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useNextBirthdays } from '../hooks';

const BirthdaysSection = () => {
  const { data, isLoading } = useNextBirthdays();
  const birthdays = data?.data ?? [];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader title={<Typography fontWeight={700}>Birthdays</Typography>} />
      <CardContent sx={{ pt: 0 }}>
        {isLoading ? (
          <List disablePadding>
            {Array.from({ length: 4 }).map((_, index) => (
              <ListItem key={index} disableGutters sx={{ gap: 1 }}>
                <Skeleton variant="circular" width={44} height={44} />
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : birthdays.length ? (
          <List disablePadding>
            {birthdays.map((user, index) => (
              <>
                <ListItem key={user.username ?? index} disableGutters sx={{ gap: 1 }}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} alt={user.username} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.username}
                      </Typography>
                    }
                    secondary={(() => {
                      const dateValue = (user as any).date ?? (user as any).birthday;
                      return dayjs(dateValue).isValid()
                        ? dayjs(dateValue).format('MMM D, YYYY')
                        : undefined;
                    })()}
                  />
                </ListItem>
                {index < birthdays.length - 1 ? <Divider sx={{ my: 1 }} /> : null}
              </>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No upcoming birthdays.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BirthdaysSection;
