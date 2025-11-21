import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { ProblemAttemptPreview, ProblemHighlight } from '../../domain/entities/stats.entity.ts';
import { difficultyColors } from '../../domain/entities/problem.entity.ts';

interface ProblemsHighlightsTabsProps {
  attempts: ProblemAttemptPreview[];
  lastContest: ProblemHighlight[];
  mostViewed: ProblemHighlight[];
}

const ProblemsHighlightsTabs = ({ attempts, lastContest, mostViewed }: ProblemsHighlightsTabsProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const tabs = useMemo(
    () => [
      { label: t('problems.tabs.lastAttempts'), items: attempts, type: 'attempts' as const },
      { label: t('problems.tabs.lastContest'), items: lastContest, type: 'highlights' as const },
      { label: t('problems.tabs.mostViewed'), items: mostViewed, type: 'highlights' as const },
    ],
    [attempts, lastContest, mostViewed, t],
  );

  const renderAttempt = (attempt: ProblemAttemptPreview) => (
    <ListItem key={attempt.id} disableGutters divider>
      <ListItemText
        primary={attempt.problemTitle}
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={attempt.verdict} size="small" />
            {attempt.language && (
              <Chip label={attempt.language} size="small" variant="outlined" color="secondary" />
            )}
            {attempt.createdAt && (
              <Typography variant="caption" color="text.secondary">
                {dayjs(attempt.createdAt).format('DD MMM, HH:mm')}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItem>
  );

  const renderHighlight = (problem: ProblemHighlight) => (
    <ListItem key={problem.id} disableGutters divider>
      <ListItemText
        primary={problem.title}
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={problem.difficultyTitle} size="small" color={difficultyColors[problem.difficulty] ?? 'default'} />
            {problem.attemptsCount && (
              <Typography variant="caption" color="text.secondary">
                {t('problems.attemptsLabel', { attempts: problem.attemptsCount })}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItem>
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="fullWidth">
            {tabs.map((item, index) => (
              <Tab key={item.label} label={item.label} value={index} />
            ))}
          </Tabs>

          <Divider />

          <Box>
            <List sx={{ py: 0 }}>
              {tabs[tab]?.items?.map((item) =>
                tabs[tab]?.type === 'attempts'
                  ? renderAttempt(item as ProblemAttemptPreview)
                  : renderHighlight(item as ProblemHighlight),
              )}
              {!tabs[tab]?.items?.length && (
                <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2 }}>
                  {t('problems.noData')}
                </Typography>
              )}
            </List>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsHighlightsTabs;
