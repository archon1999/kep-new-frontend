import { SyntheticEvent, useMemo, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Paper, Stack, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import KepIcon from 'shared/components/base/KepIcon';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import GeneralSettingsCard from '../components/GeneralSettingsCard.tsx';
import ChangePasswordCard from '../components/ChangePasswordCard.tsx';
import InformationCard from '../components/InformationCard.tsx';
import SocialCard from '../components/SocialCard.tsx';
import SkillsCard from '../components/SkillsCard.tsx';
import CareerCard from '../components/CareerCard.tsx';
import TeamsCard from '../components/TeamsCard.tsx';
import SystemCard from '../components/SystemCard.tsx';

const AccountSettingsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = useMemo(
    () => [
      { value: 'general', label: t('account.tabs.general'), icon: 'profile', content: <GeneralSettingsCard username={currentUser?.username} /> },
      { value: 'password', label: t('account.tabs.password'), icon: 'login', content: <ChangePasswordCard username={currentUser?.username} /> },
      { value: 'information', label: t('account.tabs.info'), icon: 'statistics', content: <InformationCard username={currentUser?.username} /> },
      { value: 'social', label: t('account.tabs.social'), icon: 'users', content: <SocialCard username={currentUser?.username} /> },
      { value: 'skills', label: t('account.tabs.skills'), icon: 'practice', content: <SkillsCard username={currentUser?.username} /> },
      { value: 'career', label: t('account.tabs.career'), icon: 'projects', content: <CareerCard username={currentUser?.username} /> },
      { value: 'teams', label: t('account.tabs.teams'), icon: 'users', content: <TeamsCard /> },
      { value: 'system', label: t('account.tabs.system'), icon: 'lang', content: <SystemCard /> },
    ],
    [currentUser?.username, t],
  );

  const handleChange = (_event: SyntheticEvent, value: string) => setActiveTab(value);

  return (
    <Stack spacing={3} height={1}>
      <PageHeader
        title={t('account.title')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('account.title'), active: true },
        ]}
      />
      <TabContext value={activeTab}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={4} lg={3}>
            <Paper variant="outlined" sx={{ height: '100%' }}>
              <TabList
                orientation="vertical"
                onChange={handleChange}
                value={activeTab}
                sx={{ minWidth: 1, '& .MuiTab-root': { alignItems: 'flex-start' } }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    iconPosition="start"
                    icon={<KepIcon name={tab.icon as any} />}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </TabList>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper variant="outlined">
              {tabs.map((tab) => (
                <TabPanel key={tab.value} value={tab.value} sx={{ p: { xs: 2, md: 3 } }}>
                  <Box>{tab.content}</Box>
                </TabPanel>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </TabContext>
    </Stack>
  );
};

export default AccountSettingsPage;
