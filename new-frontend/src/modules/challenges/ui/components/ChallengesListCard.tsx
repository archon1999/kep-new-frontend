import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, List, ListItem, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { ChallengesListResponse } from '../../domain/entities/challenge.entity';
import { useChallengesList } from '../../application/queries';

const buildResultLine = (challenge: ChallengesListResponse['data'][number]) => {
  const first = challenge.playerFirst;
  const second = challenge.playerSecond;
  const result = `${first.username} ${first.result || ''} vs ${second.username} ${second.result || ''}`.trim();

  return result;
};

const ChallengesListCard = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useChallengesList({ page: 1, pageSize: 5, ordering: '-finished' });

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{t('challenges.list.title')}</Typography>
          {isLoading && <Skeleton variant="rounded" height={160} />}
          {!isLoading && (!data || data.data.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.list.empty')}
            </Typography>
          )}
          {!isLoading && data && data.data.length > 0 && (
            <List disablePadding>
              {data.data.map((challenge, index) => (
                <Fragment key={challenge.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemText
                      primary={buildResultLine(challenge)}
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {t('challenges.list.meta', {
                            questions: challenge.questionsCount,
                            time: challenge.timeSeconds,
                          })}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < data.data.length - 1 && <Divider component="li" />}
                </Fragment>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengesListCard;
