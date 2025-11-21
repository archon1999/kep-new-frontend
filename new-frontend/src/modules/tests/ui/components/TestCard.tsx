import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Link, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TestSummary } from '../../domain/entities/test.entity.ts';
import { DifficultyStars } from './TestDifficulty.tsx';
import paths from 'app/routes/paths.ts';

interface Props {
  test: TestSummary;
}

const TestCard = ({ test }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {test.chapter.icon && (
            <Box component="img" src={test.chapter.icon} alt={test.chapter.title} sx={{ width: 28, height: 28 }} />
          )}
          <Typography variant="overline" color="text.secondary">
            {test.chapter.title}
          </Typography>
        </Stack>

        <Stack spacing={1} mb={2}>
          <Link component={RouterLink} to={paths.test.replace(':id', String(test.id))} color="inherit" underline="none">
            <Typography variant="h6" fontWeight={800} gutterBottom>
              {test.title}
            </Typography>
          </Link>
          {test.description && (
            <Typography variant="body2" color="text.secondary">
              {test.description}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} mb={2} alignItems="center">
          <DifficultyStars value={test.difficulty} />
          <Chip label={`${test.questionsCount} ${t('testsPage.questions')}`} size="small" />
          <Chip label={test.duration} size="small" color="primary" variant="outlined" />
        </Stack>

        {test.userBestResult && (
          <Typography variant="body2" color="text.secondary">
            {t('testsPage.bestResult', { result: test.userBestResult, total: test.questionsCount })}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          component={RouterLink}
          to={paths.test.replace(':id', String(test.id))}
        >
          {t('testsPage.viewDetails')}
        </Button>
      </Box>
    </Card>
  );
};

export default TestCard;
