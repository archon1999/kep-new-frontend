import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, List, ListItem, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useChallengesRatingList } from '../../application/queries';

const ChallengesTopRatingCard = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useChallengesRatingList({ page: 1, pageSize: 5, ordering: '-rating' });

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{t('challenges.top.title')}</Typography>
          {isLoading && <Skeleton variant="rounded" height={160} />}
          {!isLoading && (!data || data.data.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.top.empty')}
            </Typography>
          )}
          {!isLoading && data && data.data.length > 0 && (
            <List disablePadding>
              {data.data.map((rating, index) => (
                <Fragment key={rating.username}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">{rating.username}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rating.rankTitle}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {t('challenges.top.rating', { rating: rating.rating ?? '—' })}
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

export default ChallengesTopRatingCard;
