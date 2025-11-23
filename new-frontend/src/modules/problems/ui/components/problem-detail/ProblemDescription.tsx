import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Switch,
  Typography,
} from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useProblemSolution } from 'modules/problems/application/queries.ts';
import { ProblemDetail } from '../../../domain/entities/problem.entity';
import ProblemsAttemptsTable from '../ProblemsAttemptsTable';
import { HackAttemptsCard } from './HackAttemptsCard';
import ProblemBody from './ProblemBody';
import { ProblemFooter } from './ProblemFooter';
import { ProblemStatisticsTab } from './ProblemStatisticsTab';

type TabValue = 'description' | 'attempts' | 'hacks' | 'stats';

interface HackPagination {
  page: number;
  pageSize: number;
}

interface ProblemDescriptionProps {
  problem: ProblemDetail;
  selectedDifficultyColor: string;
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
  currentUser: any;
  myAttemptsOnly: boolean;
  onToggleMyAttempts: () => void;
  attempts: any[];
  attemptsTotal: number;
  attemptsPagination: GridPaginationModel;
  onAttemptsPaginationChange: (model: GridPaginationModel) => void;
  isAttemptsLoading: boolean;
  onAttemptsRefresh: () => void;
  hackAttempts: any[];
  hackTotal: number;
  hackPagination: HackPagination;
  onHackPaginationChange: (pagination: HackPagination) => void;
  onHackRefresh: () => void;
  onFavoriteToggle: () => void;
  onLike: () => void;
  onDislike: () => void;
}

export const ProblemDescription = ({
  problem,
  selectedDifficultyColor,
  activeTab,
  onTabChange,
  currentUser,
  myAttemptsOnly,
  onToggleMyAttempts,
  attempts,
  attemptsTotal,
  attemptsPagination,
  onAttemptsPaginationChange,
  isAttemptsLoading,
  onAttemptsRefresh,
  hackAttempts,
  hackTotal,
  hackPagination,
  onHackPaginationChange,
  onHackRefresh,
  onFavoriteToggle,
  onLike,
  onDislike,
}: ProblemDescriptionProps) => {
  const { t } = useTranslation();
  const [solutionExpanded, setSolutionExpanded] = useState(false);
  const { data: solution, isLoading: isSolutionLoading } = useProblemSolution(problem.id, solutionExpanded);

  return (
    <Card
      background={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        sx={{ py: 0 }}
        title={
          <Tabs
            value={activeTab}
            onChange={(_, value) => onTabChange(value)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              sx={{ fontWeight: 500 }}
              value="description"
              label={t('problems.detail.problemTab')}
              icon={<IconifyIcon icon="mdi:book-open-page-variant" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="attempts"
              label={t('problems.detail.attemptsTab')}
              icon={<IconifyIcon icon="mdi:history" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="stats"
              label={t('problems.detail.stats')}
              icon={<IconifyIcon icon="mdi:chart-bar" />}
              iconPosition="start"
            />
            <Tab
              sx={{ fontWeight: 500 }}
              value="hacks"
              label={t('problems.detail.hacksTab')}
              icon={<IconifyIcon icon="mdi:sword-cross" />}
              iconPosition="start"
              disabled={!problem?.hasCheckInput}
            />
          </Tabs>
        }
      />

      <Divider />

      <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {activeTab === 'description' ? (
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={1} flexWrap="wrap">
              <Typography variant="h5" fontWeight={600}>
                {problem.id}. {problem.title}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={problem.difficultyTitle} color={selectedDifficultyColor as any} size="medium" />
                <Chip
                  label={`${t('problems.detail.timeLimit')}: ${
                    problem.timeLimit ?? problem.availableLanguages?.[0]?.timeLimit ?? 0
                  } ms`}
                  color="default"
                  variant="filled"
                  size="medium"
                />
                <Chip
                  label={`${t('problems.detail.memoryLimit')}: ${
                    problem.memoryLimit ?? problem.availableLanguages?.[0]?.memoryLimit ?? 0
                  } MB`}
                  color="default"
                  variant="filled"
                  size="medium"
                />
              </Stack>
            </Stack>

            <ProblemBody problem={problem} currentUser={currentUser} />

            {problem.tags?.length || problem.topics?.length ? (
              <Accordion>
                <AccordionSummary sx={{ p: 1 }} expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}>
                  <Typography fontWeight={600}>{t('problems.detail.tagsTopics')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2, py: 1 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(problem.tags ?? []).map((tag) => (
                      <Chip key={tag.id} label={tag.name} color="default" size="medium" />
                    ))}
                    {(problem.topics ?? []).map((topic) => (
                      <Chip key={topic.id} label={topic.name} color="info" size="medium" />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ) : null}

            {problem.hasSolution ? (
              <Accordion expanded={solutionExpanded} onChange={(_, expanded) => setSolutionExpanded(expanded)}>
                <AccordionSummary expandIcon={<IconifyIcon icon="eva:arrow-ios-downward-fill" />}>
                  <Typography fontWeight={700}>{t('problems.detail.solution')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isSolutionLoading ? (
                    <LinearProgress />
                  ) : solution ? (
                    <Stack spacing={2}>
                      <Typography dangerouslySetInnerHTML={{ __html: solution.solution }} />
                      {solution.codes.map((code: any) => (
                        <Card key={code.lang} variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              {code.lang}
                            </Typography>
                            <Box
                              sx={{
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              {code.code}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">{t('problems.detail.noSolution')}</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ) : null}
          </Stack>
        ) : null}

        {activeTab === 'attempts' ? (
          <>
            {currentUser ? (
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <FormControlLabel
                  control={<Switch checked={myAttemptsOnly} onChange={onToggleMyAttempts} />}
                  label={t('problems.detail.onlyMyAttempts')}
                />
              </Stack>
            ) : null}
            <ProblemsAttemptsTable
              attempts={attempts}
              total={attemptsTotal}
              paginationModel={attemptsPagination}
              onPaginationChange={onAttemptsPaginationChange}
              isLoading={isAttemptsLoading}
              onRerun={onAttemptsRefresh}
              showProblemColumn={false}
            />
          </>
        ) : null}

        {activeTab === 'stats' ? <ProblemStatisticsTab problemId={problem.id} /> : null}

        {activeTab === 'hacks' ? (
          <HackAttemptsCard
            attempts={hackAttempts}
            total={hackTotal}
            pagination={hackPagination}
            onPaginationChange={onHackPaginationChange}
            onRefresh={onHackRefresh}
          />
        ) : null}
      </CardContent>

      {activeTab === 'description' ? (
        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            px: 3,
            py: 1.75,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <ProblemFooter
            problem={problem}
            onFavoriteToggle={onFavoriteToggle}
            onLike={onLike}
            onDislike={onDislike}
          />
        </Box>
      ) : null}
    </Card>
  );
};
