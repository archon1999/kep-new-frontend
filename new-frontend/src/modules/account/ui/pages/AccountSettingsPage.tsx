import { useEffect, useMemo, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Alert,
  Avatar,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Slider,
  Stack,
  Tab,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PasswordTextField from 'shared/components/common/PasswordTextField';
import AccountSectionCard from '../components/AccountSectionCard';
import {
  useChangePassword,
  useCreateTeam,
  useJoinTeam,
  useRefreshTeamCode,
  useUpdateEducations,
  useUpdateGeneralInfo,
  useUpdateProfileInfo,
  useUpdateSkills,
  useUpdateSocialLinks,
  useUpdateTechnologies,
  useUpdateWorkExperiences,
} from '../../application/mutations';
import {
  useEducations,
  useGeneralInfo,
  useProfileInfo,
  useSkills,
  useSocialLinks,
  useTeams,
  useTechnologies,
  useWorkExperiences,
} from '../../application/queries';
import { useAuth } from 'app/providers/AuthProvider';
import { Education, Technology, WorkExperience } from '../../domain/entities/account.entity';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useSnackbar } from 'notistack';

const TABS = [
  { value: 'general', label: 'account.tabs.general', icon: 'material-symbols:person-outline-rounded' },
  { value: 'information', label: 'account.tabs.information', icon: 'material-symbols:info-outline-rounded' },
  { value: 'social', label: 'account.tabs.social', icon: 'material-symbols:link-rounded' },
  { value: 'skills', label: 'account.tabs.skills', icon: 'material-symbols:monitoring-rounded' },
  { value: 'career', label: 'account.tabs.career', icon: 'material-symbols:trending-up-rounded' },
  { value: 'teams', label: 'account.tabs.teams', icon: 'material-symbols:groups-2-outline' },
  { value: 'password', label: 'account.tabs.password', icon: 'material-symbols:lock-outline-rounded' },
  { value: 'system', label: 'account.tabs.system', icon: 'material-symbols:settings-outline-rounded' },
];

const AccountSettingsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [navOpen, setNavOpen] = useState(!downMd);

  useEffect(() => {
    setNavOpen(!downMd);
  }, [downMd]);

  const tabList = (
    <Stack spacing={2} sx={{ p: 3, width: { xs: 1, md: 320 } }}>
      <Typography variant="h5" fontWeight={800} display="flex" alignItems="center" gap={1}>
        <IconifyIcon icon="material-symbols:settings-outline-rounded" />
        {t('account.heading')}
      </Typography>
      <Divider />
      <TabList
        orientation="vertical"
        onChange={(_, val) => setActiveTab(val)}
        value={activeTab}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          [`& .MuiTabs-flexContainer`]: {
            alignItems: 'stretch',
            gap: 1,
          },
          [`& .MuiTab-root`]: {
            justifyContent: 'flex-start',
            borderRadius: 2,
            textAlign: 'left',
            px: 2,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={<IconifyIcon icon={tab.icon} />}
            iconPosition="start"
            label={<Typography fontWeight={700}>{t(tab.label)}</Typography>}
            onClick={() => {
              if (downMd) {
                setNavOpen(false);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ))}
      </TabList>
    </Stack>
  );

  return (
    <TabContext value={activeTab}>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-start' }}>
        {downMd ? (
          <Drawer
            anchor="left"
            open={navOpen}
            onClose={() => setNavOpen(false)}
            slotProps={{ paper: { sx: { width: '100%', maxWidth: 360 } } }}
          >
            {tabList}
          </Drawer>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.elevation1',
              minWidth: 320,
              position: 'sticky',
              top: theme.mixins.toolbar.minHeight,
            }}
          >
            {tabList}
          </Paper>
        )}

        <Stack flex={1} spacing={3}>
          <TabPanel value="general" sx={{ p: 0 }}>
            <GeneralSettingsCard />
          </TabPanel>
          <TabPanel value="information" sx={{ p: 0 }}>
            <InformationCard />
          </TabPanel>
          <TabPanel value="social" sx={{ p: 0 }}>
            <SocialCard />
          </TabPanel>
          <TabPanel value="skills" sx={{ p: 0 }}>
            <SkillsCard />
          </TabPanel>
          <TabPanel value="career" sx={{ p: 0 }}>
            <CareerCard />
          </TabPanel>
          <TabPanel value="teams" sx={{ p: 0 }}>
            <TeamsCard />
          </TabPanel>
          <TabPanel value="password" sx={{ p: 0 }}>
            <PasswordCard />
          </TabPanel>
          <TabPanel value="system" sx={{ p: 0 }}>
            <SystemCard />
          </TabPanel>
        </Stack>
      </Stack>
    </TabContext>
  );
};

const GeneralSettingsCard = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const { data, isLoading, mutate } = useGeneralInfo();
  const { trigger, isMutating } = useUpdateGeneralInfo();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleFileChange = (field: 'avatar' | 'coverPhoto') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form || !currentUser) return;
    await trigger(form)
      .then(async (updated) => {
        await mutate(updated, { revalidate: false });
        await refreshCurrentUser();
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  if (isLoading || !form) {
    return <Alert severity="info">{t('account.loading')}</Alert>;
  }

  return (
    <AccountSectionCard
      title={t('account.general.title')}
      icon={<IconifyIcon icon="material-symbols:person-outline-rounded" />}
      actions={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setForm(data)} disabled={isMutating}>
            {t('common.reset')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isMutating}>
            {t('common.save')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Avatar src={form.avatar ?? currentUser?.avatar ?? undefined} sx={{ width: 96, height: 96 }} />
          <Stack direction="row" spacing={1}>
            <Button component="label" variant="contained" size="small" startIcon={<IconifyIcon icon="mdi:upload" />}>
              {t('account.general.uploadAvatar')}
              <input hidden type="file" accept="image/*" onChange={handleFileChange('avatar')} />
            </Button>
            <Button component="label" variant="outlined" size="small" startIcon={<IconifyIcon icon="mdi:image-area" />}>
              {t('account.general.uploadCover')}
              <input hidden type="file" accept="image/*" onChange={handleFileChange('coverPhoto')} />
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.username')}
              value={form.username || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.email')}
              value={form.email || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.firstName')}
              value={form.firstName || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.lastName')}
              value={form.lastName || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          </Grid>
        </Grid>
      </Stack>
    </AccountSectionCard>
  );
};

const InformationCard = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useProfileInfo();
  const { trigger, isMutating } = useUpdateProfileInfo();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(data);

  useEffect(() => setForm(data), [data]);

  const handleSave = async () => {
    if (!form) return;
    await trigger(form)
      .then(async (updated) => {
        await mutate(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  if (isLoading || !form) {
    return <Alert severity="info">{t('account.loading')}</Alert>;
  }

  return (
    <AccountSectionCard
      title={t('account.information.title')}
      icon={<IconifyIcon icon="material-symbols:info-outline-rounded" />}
      actions={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setForm(data)} disabled={isMutating}>
            {t('common.reset')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isMutating}>
            {t('common.save')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <TextField
          label={t('account.fields.bio')}
          value={form.bio || ''}
          onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
          fullWidth
          multiline
          minRows={3}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              label={t('account.fields.birthDate')}
              value={form.dateOfBirth ? dayjs(form.dateOfBirth) : null}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, dateOfBirth: value ? value.toISOString() : undefined }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.website')}
              value={form.website || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.country')}
              value={form.country || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.region')}
              value={form.region || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
            />
          </Grid>
        </Grid>
      </Stack>
    </AccountSectionCard>
  );
};

const SocialCard = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useSocialLinks();
  const { trigger, isMutating } = useUpdateSocialLinks();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(data);

  useEffect(() => setForm(data), [data]);

  const handleSave = async () => {
    if (!form) return;
    await trigger(form)
      .then(async (updated) => {
        await mutate(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  if (isLoading || !form) {
    return <Alert severity="info">{t('account.loading')}</Alert>;
  }

  return (
    <AccountSectionCard
      title={t('account.social.title')}
      icon={<IconifyIcon icon="material-symbols:link-rounded" />}
      actions={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setForm(data)} disabled={isMutating}>
            {t('common.reset')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isMutating}>
            {t('common.save')}
          </Button>
        </Stack>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('account.fields.codeforces')}
            value={form.codeforcesHandle || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, codeforcesHandle: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('account.fields.codeforcesBadge')}
            value={form.codeforcesBadge || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, codeforcesBadge: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('account.fields.telegram')}
            value={form.telegram || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, telegram: e.target.value }))}
          />
        </Grid>
      </Grid>
    </AccountSectionCard>
  );
};

const SkillsCard = () => {
  const { t } = useTranslation();
  const { data: skills, isLoading: loadingSkills, mutate: mutateSkills } = useSkills();
  const { data: technologies, mutate: mutateTech } = useTechnologies();
  const { trigger: triggerSkills, isMutating: updatingSkills } = useUpdateSkills();
  const { trigger: triggerTechnologies, isMutating: updatingTech } = useUpdateTechnologies();
  const { enqueueSnackbar } = useSnackbar();
  const [skillsForm, setSkillsForm] = useState(skills);
  const [techList, setTechList] = useState<Technology[]>(technologies || []);

  useEffect(() => setSkillsForm(skills), [skills]);
  useEffect(() => setTechList(technologies || []), [technologies]);

  const handleSaveSkills = async () => {
    if (!skillsForm) return;
    await triggerSkills(skillsForm)
      .then(async (updated) => {
        await mutateSkills(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  const handleSaveTech = async () => {
    await triggerTechnologies(techList)
      .then(async (updated) => {
        await mutateTech(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  const sliderMarks = useMemo(() => [0, 25, 50, 75, 100], []);

  if (loadingSkills || !skillsForm) {
    return <Alert severity="info">{t('account.loading')}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <AccountSectionCard
        title={t('account.skills.title')}
        icon={<IconifyIcon icon="material-symbols:monitoring-rounded" />}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setSkillsForm(skills)} disabled={updatingSkills}>
              {t('common.reset')}
            </Button>
            <Button variant="contained" onClick={handleSaveSkills} disabled={updatingSkills}>
              {t('common.save')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={3}>
          {[{
            key: 'python',
            label: 'Python',
          },
          { key: 'webDevelopment', label: t('account.fields.webDevelopment') },
          { key: 'webScraping', label: t('account.fields.webScraping') },
          { key: 'algorithms', label: t('account.fields.algorithms') },
          { key: 'dataScience', label: t('account.fields.dataScience') }].map((item) => (
            <Grid key={item.key} item xs={12} md={6}>
              <Typography fontWeight={700} mb={1}>
                {item.label}
              </Typography>
              <Slider
                value={skillsForm[item.key as keyof typeof skillsForm] ?? 0}
                marks={sliderMarks.map((value) => ({ value, label: `${value}%` }))}
                step={1}
                min={0}
                max={100}
                onChange={(_, value) =>
                  setSkillsForm((prev) => ({ ...prev, [item.key]: Array.isArray(value) ? value[0] : value }))
                }
              />
            </Grid>
          ))}
        </Grid>
      </AccountSectionCard>

      <AccountSectionCard
        title={t('account.skills.technologies')}
        icon={<IconifyIcon icon="material-symbols:code-blocks-outline-rounded" />}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setTechList(technologies || [])} disabled={updatingTech}>
              {t('common.reset')}
            </Button>
            <Button variant="contained" onClick={handleSaveTech} disabled={updatingTech}>
              {t('common.save')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          {techList.map((tech, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, borderRadius: 1.5, borderColor: 'divider' }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  label={t('account.fields.technologyName')}
                  value={tech.text}
                  onChange={(e) =>
                    setTechList((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, text: e.target.value } : item)),
                    )
                  }
                />
                <TextField
                  fullWidth
                  label={t('account.fields.iconClass')}
                  value={tech.devIconClass || ''}
                  onChange={(e) =>
                    setTechList((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, devIconClass: e.target.value } : item)),
                    )
                  }
                />
                <TextField
                  fullWidth
                  label={t('account.fields.badgeColor')}
                  value={tech.badgeColor || ''}
                  onChange={(e) =>
                    setTechList((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, badgeColor: e.target.value } : item)),
                    )
                  }
                />
                <IconButton color="error" onClick={() => setTechList((prev) => prev.filter((_, idx) => idx !== index))}>
                  <IconifyIcon icon="material-symbols:delete-outline-rounded" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          <Button
            variant="outlined"
            startIcon={<IconifyIcon icon="material-symbols:add-circle-outline-rounded" />}
            onClick={() => setTechList((prev) => [...prev, { text: '', devIconClass: '', badgeColor: '' }])}
          >
            {t('account.skills.addTechnology')}
          </Button>
        </Stack>
      </AccountSectionCard>
    </Stack>
  );
};

const CareerCard = () => {
  const { t } = useTranslation();
  const { data: educations, mutate: mutateEducations } = useEducations();
  const { data: workExperiences, mutate: mutateWork } = useWorkExperiences();
  const { trigger: triggerEducation, isMutating: updatingEducation } = useUpdateEducations();
  const { trigger: triggerWork, isMutating: updatingWork } = useUpdateWorkExperiences();
  const { enqueueSnackbar } = useSnackbar();
  const [educationList, setEducationList] = useState<Education[]>(educations || []);
  const [workList, setWorkList] = useState<WorkExperience[]>(workExperiences || []);

  useEffect(() => setEducationList(educations || []), [educations]);
  useEffect(() => setWorkList(workExperiences || []), [workExperiences]);

  const saveEducation = async () => {
    await triggerEducation(educationList)
      .then(async (updated) => {
        await mutateEducations(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  const saveWork = async () => {
    await triggerWork(workList)
      .then(async (updated) => {
        await mutateWork(updated, { revalidate: false });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  return (
    <Stack spacing={3}>
      <AccountSectionCard
        title={t('account.career.education')}
        icon={<IconifyIcon icon="material-symbols:school-outline" />}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setEducationList(educations || [])} disabled={updatingEducation}>
              {t('common.reset')}
            </Button>
            <Button variant="contained" onClick={saveEducation} disabled={updatingEducation}>
              {t('common.save')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          {educationList.map((item, index) => (
            <EducationRow
              key={index}
              item={item}
              onChange={(updated) =>
                setEducationList((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))
              }
              onDelete={() => setEducationList((prev) => prev.filter((_, idx) => idx !== index))}
            />
          ))}
          <Button
            variant="outlined"
            startIcon={<IconifyIcon icon="material-symbols:add-circle-outline-rounded" />}
            onClick={() => setEducationList((prev) => [...prev, {}])}
          >
            {t('account.career.addEducation')}
          </Button>
        </Stack>
      </AccountSectionCard>

      <AccountSectionCard
        title={t('account.career.work')}
        icon={<IconifyIcon icon="material-symbols:work-outline-rounded" />}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setWorkList(workExperiences || [])} disabled={updatingWork}>
              {t('common.reset')}
            </Button>
            <Button variant="contained" onClick={saveWork} disabled={updatingWork}>
              {t('common.save')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          {workList.map((item, index) => (
            <WorkRow
              key={index}
              item={item}
              onChange={(updated) => setWorkList((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
              onDelete={() => setWorkList((prev) => prev.filter((_, idx) => idx !== index))}
            />
          ))}
          <Button
            variant="outlined"
            startIcon={<IconifyIcon icon="material-symbols:add-circle-outline-rounded" />}
            onClick={() => setWorkList((prev) => [...prev, {}])}
          >
            {t('account.career.addWork')}
          </Button>
        </Stack>
      </AccountSectionCard>
    </Stack>
  );
};

const EducationRow = ({ item, onChange, onDelete }: { item: Education; onChange: (item: Education) => void; onDelete: () => void }) => {
  const { t } = useTranslation();
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.organization')}
              value={item.organization || ''}
              onChange={(e) => onChange({ ...item, organization: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.degree')}
              value={item.degree || ''}
              onChange={(e) => onChange({ ...item, degree: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('account.fields.fromYear')}
              value={item.fromYear ?? ''}
              onChange={(e) => onChange({ ...item, fromYear: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('account.fields.toYear')}
              value={item.toYear ?? ''}
              onChange={(e) => onChange({ ...item, toYear: Number(e.target.value) })}
            />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end">
          <Button color="error" startIcon={<IconifyIcon icon="material-symbols:delete-outline-rounded" />} onClick={onDelete}>
            {t('common.delete')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const WorkRow = ({ item, onChange, onDelete }: { item: WorkExperience; onChange: (item: WorkExperience) => void; onDelete: () => void }) => {
  const { t } = useTranslation();
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.company')}
              value={item.company || ''}
              onChange={(e) => onChange({ ...item, company: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('account.fields.jobTitle')}
              value={item.jobTitle || ''}
              onChange={(e) => onChange({ ...item, jobTitle: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('account.fields.fromYear')}
              value={item.fromYear ?? ''}
              onChange={(e) => onChange({ ...item, fromYear: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('account.fields.toYear')}
              value={item.toYear ?? ''}
              onChange={(e) => onChange({ ...item, toYear: Number(e.target.value) })}
            />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end">
          <Button color="error" startIcon={<IconifyIcon icon="material-symbols:delete-outline-rounded" />} onClick={onDelete}>
            {t('common.delete')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const TeamsCard = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useTeams();
  const { trigger: createTeam, isMutating: creatingTeam } = useCreateTeam();
  const { trigger: joinTeam, isMutating: joiningTeam } = useJoinTeam();
  const { trigger: refreshCode, isMutating: refreshing } = useRefreshTeamCode();
  const { enqueueSnackbar } = useSnackbar();
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    await createTeam({ name: teamName })
      .then(async (newTeam) => {
        await mutate([...(data || []), newTeam], { revalidate: true });
        setTeamName('');
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  const handleJoin = async () => {
    if (!teamCode.trim()) return;
    await joinTeam({ code: teamCode })
      .then(async (team) => {
        await mutate([...(data || []), team], { revalidate: true });
        setTeamCode('');
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  const handleRefresh = async (code: string) => {
    await refreshCode({ code })
      .then(async (updated) => {
        await mutate((prev) => prev?.map((team) => (team.code === code ? updated : team)), { revalidate: true });
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard
      title={t('account.teams.title')}
      icon={<IconifyIcon icon="material-symbols:groups-2-outline" />}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t('account.teams.teamName')}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<IconifyIcon icon="material-symbols:add-circle-outline-rounded" />}
            onClick={handleCreate}
            disabled={creatingTeam}
          >
            {t('account.teams.create')}
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t('account.teams.teamCode')}
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <Button
            variant="outlined"
            startIcon={<IconifyIcon icon="material-symbols:login-rounded" />}
            onClick={handleJoin}
            disabled={joiningTeam}
          >
            {t('account.teams.join')}
          </Button>
        </Stack>

        {isLoading && <Alert severity="info">{t('account.loading')}</Alert>}

        <Stack spacing={2}>
          {(data || []).map((team) => (
            <Paper key={team.code} variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: 'divider' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {team.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`${t('account.teams.code')}: ${team.code}`} size="small" />
                    {team.membersCount !== undefined && (
                      <Chip
                        label={`${t('account.teams.members')}: ${team.membersCount}`}
                        size="small"
                        icon={<IconifyIcon icon="material-symbols:group-outline-rounded" />}
                      />
                    )}
                  </Stack>
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IconifyIcon icon="material-symbols:refresh-rounded" />}
                  onClick={() => handleRefresh(team.code)}
                  disabled={refreshing}
                >
                  {t('account.teams.refresh')}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </AccountSectionCard>
  );
};

const PasswordCard = () => {
  const { t } = useTranslation();
  const { trigger, isMutating } = useChangePassword();
  const { enqueueSnackbar } = useSnackbar();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = async () => {
    if (newPassword !== confirmPassword) {
      enqueueSnackbar(t('account.password.mismatch'), { variant: 'warning' });
      return;
    }
    await trigger({ oldPassword, newPassword })
      .then(() => {
        enqueueSnackbar(t('account.messages.saved'), { variant: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => enqueueSnackbar(t('account.messages.error'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard
      title={t('account.password.title')}
      icon={<IconifyIcon icon="material-symbols:lock-outline-rounded" />}
      actions={
        <Button variant="contained" onClick={handleChange} disabled={isMutating}>
          {t('account.password.change')}
        </Button>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <PasswordTextField
            fullWidth
            label={t('account.fields.oldPassword')}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PasswordTextField
            fullWidth
            label={t('account.fields.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PasswordTextField
            fullWidth
            label={t('account.fields.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Grid>
      </Grid>
    </AccountSectionCard>
  );
};

const SystemCard = () => {
  const { t } = useTranslation();
  const [successSound, setSuccessSound] = useState(localStorage.getItem('success-sound') || 'default');
  const [homeSound, setHomeSound] = useState(localStorage.getItem('home-sound') || 'default');
  const [animations, setAnimations] = useState(localStorage.getItem('ui-animations') !== 'off');

  useEffect(() => {
    localStorage.setItem('success-sound', successSound);
  }, [successSound]);

  useEffect(() => {
    localStorage.setItem('home-sound', homeSound);
  }, [homeSound]);

  useEffect(() => {
    localStorage.setItem('ui-animations', animations ? 'on' : 'off');
  }, [animations]);

  return (
    <AccountSectionCard
      title={t('account.system.title')}
      icon={<IconifyIcon icon="material-symbols:settings-outline-rounded" />}
    >
      <Stack spacing={2}>
        <TextField
          select
          label={t('account.system.successSound')}
          value={successSound}
          onChange={(e) => setSuccessSound(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="default">{t('account.system.default')}</option>
          <option value="celebration">{t('account.system.celebration')}</option>
          <option value="pop">{t('account.system.pop')}</option>
        </TextField>
        <TextField
          select
          label={t('account.system.homeSound')}
          value={homeSound}
          onChange={(e) => setHomeSound(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="default">{t('account.system.default')}</option>
          <option value="pulse">{t('account.system.pulse')}</option>
          <option value="soft">{t('account.system.soft')}</option>
        </TextField>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>{t('account.system.animations')}</Typography>
          <Chip
            label={animations ? t('common.enabled') : t('common.disabled')}
            color={animations ? 'success' : 'default'}
            onClick={() => setAnimations((prev) => !prev)}
          />
        </Stack>
      </Stack>
    </AccountSectionCard>
  );
};

export default AccountSettingsPage;
