import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContestPreview, Problem, ProblemAttempt } from '../../domain';

interface Props {
  attempts?: ProblemAttempt[];
  lastContest?: ContestPreview | null;
  mostViewed?: Problem[];
}

const ProblemsActivityTabs = ({ attempts = [], lastContest, mostViewed = [] }: Props) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const tabs = useMemo(
    () => [
      { label: t('problems.tabs.lastAttempts'), key: 'attempts' },
      { label: t('problems.tabs.lastContest'), key: 'contest' },
      { label: t('problems.tabs.mostViewed'), key: 'viewed' },
    ],
    [t],
  );

  const renderAttempts = () => (
    <Stack spacing={1} direction="column">
      {attempts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('problems.tabs.emptyAttempts')}
        </Typography>
      ) : (
        attempts.map((attempt) => (
          <Stack
            key={attempt.id}
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="column" spacing={0.25}>
              <Typography variant="subtitle2">{attempt.problemTitle}</Typography>
              <Typography variant="caption" color="text.secondary">
                {attempt.langFull}
              </Typography>
            </Stack>
            <Chip label={attempt.verdictTitle} size="small" color="primary" variant="outlined" />
          </Stack>
        ))
      )}
    </Stack>
  );

  const renderContest = () => (
    <Stack spacing={1} direction="column">
      {lastContest ? (
        <>
          <Typography variant="subtitle1" fontWeight={700}>
            {lastContest.title}
          </Typography>
          <Divider />
          <Stack direction="column" spacing={0.75}>
            {lastContest.problems.map((problem) => (
              <Stack key={problem.id} direction="row" spacing={1} alignItems="center">
                <Chip label={problem.symbol} size="small" />
                <Typography variant="body2">{problem.title}</Typography>
              </Stack>
            ))}
          </Stack>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('problems.tabs.emptyContest')}
        </Typography>
      )}
    </Stack>
  );

  const renderMostViewed = () => (
    <Stack spacing={1} direction="column">
      {mostViewed.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('problems.tabs.emptyViewed')}
        </Typography>
      ) : (
        mostViewed.map((problem) => (
          <Stack key={problem.id} direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight={700}>
              {problem.title}
            </Typography>
            <Chip label={problem.difficultyTitle} size="small" variant="outlined" />
          </Stack>
        ))
      )}
    </Stack>
  );

  const renderContent = () => {
    if (tabs[active]?.key === 'contest') return renderContest();
    if (tabs[active]?.key === 'viewed') return renderMostViewed();
    return renderAttempts();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Tabs
            value={active}
            onChange={(_, value) => setActive(value)}
            variant="fullWidth"
            textColor="secondary"
            indicatorColor="secondary"
          >
            {tabs.map((tab, index) => (
              <Tab key={tab.key} label={tab.label} value={index} />
            ))}
          </Tabs>

          {renderContent()}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsActivityTabs;
