import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, List, ListItem, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useChallengeCalls } from '../../application/queries';

dayjs.extend(relativeTime);

const formatTime = (seconds: number) => `${seconds}s`;

const ChallengeCallsList = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useChallengeCalls();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{t('challenges.queue.title')}</Typography>
          {isLoading && <Skeleton variant="rounded" height={160} />}
          {!isLoading && (!data || data.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.queue.empty')}
            </Typography>
          )}
          {!isLoading && data && data.length > 0 && (
            <List disablePadding>
              {data.map((item, index) => (
                <Fragment key={item.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">{item.username}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.rankTitle}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {t('challenges.queue.meta', {
                            questions: item.questionsCount,
                            time: formatTime(item.timeSeconds),
                          })}
                          {item.created &&
                            ` · ${t('challenges.queue.created', { time: dayjs(item.created).fromNow() })}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < data.length - 1 && <Divider component="li" />}
                </Fragment>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeCallsList;
