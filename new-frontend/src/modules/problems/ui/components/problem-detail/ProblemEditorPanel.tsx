import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import { resources } from 'app/routes/resources';
import { AttemptLangs, ProblemDetail, ProblemSampleTest } from '../../../domain/entities/problem.entity';
import { VerticalHandle } from './PanelHandles';

const getEditorLanguage = (lang: string) =>
  ({
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
    [AttemptLangs.TS]: 'typescript',
    [AttemptLangs.RUST]: 'rust',
  }[lang] || lang || 'javascript');

interface ProblemEditorPanelProps {
  problem?: ProblemDetail;
  code: string;
  onCodeChange: (value: string) => void;
  selectedLang: string;
  onLangChange: (value: string) => void;
  sampleTests: ProblemSampleTest[];
  selectedSampleIndex: number;
  onSampleChange: (value: number) => void;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  answer: string;
  onRun: () => void;
  onSubmit: () => void;
  onCheckSamples: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isCheckingSamples: boolean;
  checkSamplesResult: Array<{ verdict: number; input?: string; output?: string; answer?: string }>;
  editorTab: 'console' | 'samples';
  onEditorTabChange: (value: 'console' | 'samples') => void;
  currentUser: any;
  canUseCheckSamples: boolean;
  editorTheme: string;
}

export const ProblemEditorPanel = ({
  problem,
  code,
  onCodeChange,
  selectedLang,
  onLangChange,
  sampleTests,
  selectedSampleIndex,
  onSampleChange,
  input,
  onInputChange,
  output,
  answer,
  onRun,
  onSubmit,
  onCheckSamples,
  isRunning,
  isSubmitting,
  isCheckingSamples,
  checkSamplesResult,
  editorTab,
  onEditorTabChange,
  currentUser,
  canUseCheckSamples,
  editorTheme,
}: ProblemEditorPanelProps) => {
  const { t } = useTranslation();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(editorTheme);
    }
  }, [monaco, editorTheme]);

  if (!currentUser) {
    return (
      <Box sx={{ height: '100%', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card variant="outlined" sx={{ maxWidth: 520 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('problems.detail.signInToSolve')}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {t('problems.detail.signInSubtitle')}
            </Typography>
            <Button component={RouterLink} to={resources.Login} variant="contained">
              {t('auth.login')}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
      <Tabs value="code" textColor="primary" indicatorColor="primary" sx={{ mb: 1 }}>
        <Tab
          value="code"
          label={t('problems.detail.codeTab', { defaultValue: 'Code' })}
          icon={<IconifyIcon icon="mdi:code-tags" color="#7E57C2" />}
          iconPosition="start"
        />
      </Tabs>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" mb={1.5}>
        <TextField
          select
          size="small"
          label={t('problems.detail.language')}
          value={selectedLang}
          onChange={(event) => onLangChange(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          {problem?.availableLanguages?.map((lang) => (
            <MenuItem key={lang.lang} value={lang.lang}>
              {lang.langFull || lang.lang}
            </MenuItem>
          ))}
        </TextField>

        {sampleTests.length ? (
          <TextField
            select
            size="small"
            label={t('problems.detail.sample')}
            value={selectedSampleIndex}
            onChange={(event) => onSampleChange(Number(event.target.value))}
            sx={{ minWidth: 140 }}
          >
            {sampleTests.map((_, index) => (
              <MenuItem key={index} value={index}>
                #{index + 1}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Stack>

      <PanelGroup direction="vertical" style={{ height: 'calc(100% - 40px)' }}>
        <Panel defaultSize={65} minSize={45}>
          <Box
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Editor
              key={editorTheme}
              language={getEditorLanguage(selectedLang)}
              value={code}
              onChange={(value) => onCodeChange(value ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
              theme={editorTheme}
              loading={<LinearProgress />}
              height="100%"
            />
          </Box>
        </Panel>

        <VerticalHandle />

        <Panel defaultSize={35} minSize={25}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={editorTab}
              onChange={(_, value) => onEditorTabChange(value)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="console" label={t('problems.detail.console')} />
              <Tab value="samples" label={t('problems.detail.samplesResult')} />
            </Tabs>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {editorTab === 'console' ? (
                <Stack direction="column" spacing={1.5}>
                  <TextField
                    multiline
                    minRows={3}
                    label={t('problems.detail.customInput')}
                    value={input}
                    onChange={(event) => onInputChange(event.target.value)}
                  />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <TextField
                      fullWidth
                      label={t('problems.detail.yourOutput')}
                      multiline
                      minRows={4}
                      value={output}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label={t('problems.detail.answer')}
                      multiline
                      minRows={4}
                      value={answer}
                      InputProps={{ readOnly: true }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.run')}>
                      <span>
                        <IconButton color="primary" onClick={onRun} disabled={isRunning || !code} size="large">
                          <IconifyIcon icon="mdi:play-circle-outline" width={20} height={20} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('problems.detail.checkSamples')}>
                      <span>
                        <IconButton
                          color="secondary"
                          onClick={onCheckSamples}
                          disabled={isCheckingSamples || !canUseCheckSamples || !code}
                          size="large"
                        >
                          <IconifyIcon icon="mdi:check-all" width={20} height={20} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('problems.detail.submit')}>
                      <span>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={onSubmit}
                          disabled={isSubmitting || !code}
                          sx={{ minWidth: 44, px: 1 }}
                        >
                          <IconifyIcon icon="mdi:send-outline" width={18} height={18} />
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="column" spacing={1}>
                  {checkSamplesResult.length === 0 ? (
                    <Typography color="text.secondary">{t('problems.detail.noSamplesResult')}</Typography>
                  ) : (
                    checkSamplesResult.map((result, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2">#{index + 1}</Typography>
                            {result.verdict != null ? <AttemptVerdict verdict={result.verdict} /> : null}
                          </Stack>
                          {result.input ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.customInput')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.input}
                              </Typography>
                            </Box>
                          ) : null}
                          {result.output ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.yourOutput')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.output}
                              </Typography>
                            </Box>
                          ) : null}
                          {result.answer ? (
                            <Box mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {t('problems.detail.answer')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                {result.answer}
                              </Typography>
                            </Box>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              )}
            </Box>
          </Card>
        </Panel>
      </PanelGroup>
    </Box>
  );
};
