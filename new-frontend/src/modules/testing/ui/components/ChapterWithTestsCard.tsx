import { Link as RouterLink } from 'react-router';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import { ChapterWithTests } from '../../domain/entities/chapter.entity';
import { useAuth } from 'app/providers/AuthProvider';

interface ChapterWithTestsCardProps {
  chapter: ChapterWithTests;
}

const ChapterWithTestsCard = ({ chapter }: ChapterWithTestsCardProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const renderBestResult = (userBestResult?: number, questionsCount?: number) => {
    if (!currentUser) return null;

    const totalQuestions = questionsCount ?? 0;
    const bestResult = userBestResult ?? 0;
    const isPerfect = totalQuestions > 0 && bestResult === totalQuestions;
    const hasProgress = !isPerfect && bestResult > 0;

    return (
      <Tooltip title={t('testing.bestResult')} arrow placement="top">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 700, color: isPerfect ? 'success.main' : hasProgress ? 'warning.main' : 'text.secondary' }}
          >
            {bestResult}
          </Typography>
          <Typography component="span" variant="body2" color="text.secondary">
            / {totalQuestions || '?'}
          </Typography>
        </Stack>
      </Tooltip>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={<Avatar alt={chapter.title} src={chapter.icon} variant="rounded" sx={{ width: 44, height: 44 }} />}
        title={
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {chapter.title}
          </Typography>
        }
        sx={{ alignItems: 'center', gap: 1.5, pb: 1.5 }}
      />

      <Divider />

      <CardContent sx={{ px: 0, py: 0 }}>
        <List disablePadding>
          {chapter.tests.map((test, index) => (
            <ListItemButton
              key={test.id}
              divider={index < chapter.tests.length - 1}
              component={RouterLink}
              to={getResourceById(resources.Test, test.id)}
              sx={{
                gap: 1.5,
                py: 1.5,
                px: 2,
                alignItems: 'center',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                <IconifyIcon icon="mdi:clipboard-text-outline" fontSize={22} color="success.main" />
                <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {test.title}
                </Typography>
              </Stack>

              {renderBestResult(test.userBestResult, test.questionsCount)}
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ChapterWithTestsCard;
