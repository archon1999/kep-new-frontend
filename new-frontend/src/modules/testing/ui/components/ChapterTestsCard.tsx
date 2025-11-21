import { useMemo } from 'react';
import { Card, CardContent, CardHeader, Divider, Avatar, Stack, Typography, List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TestListItem from './TestListItem';
import { Chapter, Test } from '../../domain/entities/testing.entity';

type ChapterTestsCardProps = {
  chapter: Chapter;
  tests: Test[];
};

const ChapterTestsCard = ({ chapter, tests }: ChapterTestsCardProps) => {
  const { t } = useTranslation();

  const avatar = useMemo(() => {
    if (chapter.icon) {
      return <Avatar src={chapter.icon} variant="rounded" sx={{ bgcolor: 'transparent' }} />;
    }

    return (
      <Avatar variant="rounded">
        {chapter.title.charAt(0).toUpperCase()}
      </Avatar>
    );
  }, [chapter.icon, chapter.title]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={avatar}
        title={
          <Typography variant="h6" noWrap>
            {chapter.title}
          </Typography>
        }
        subheader={t('tests.testsCount', { count: chapter.testsCount })}
      />
      <Divider sx={{ mx: 2 }} />
      <CardContent sx={{ pt: 2 }}>
        <Stack spacing={1.5}>
          <List disablePadding>
            {tests.map((test) => (
              <TestListItem key={test.id} test={test} />
            ))}
          </List>
          {tests.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('tests.empty')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChapterTestsCard;
