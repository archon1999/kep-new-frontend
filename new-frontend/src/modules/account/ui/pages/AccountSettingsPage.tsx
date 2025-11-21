import { TabContext, TabPanel } from '@mui/lab';
import { Card, Divider, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePasswordForm from '../components/ChangePasswordForm';
import GeneralInfoForm from '../components/GeneralInfoForm';
import InfoForm from '../components/InfoForm';
import SkillsForm from '../components/SkillsForm';
import SocialForm from '../components/SocialForm';
import CareerForm from '../components/CareerForm';
import TeamsPanel from '../components/TeamsPanel';

const AccountSettingsPage = () => {
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      { value: 'general', label: t('accountSettings.general.tab') },
      { value: 'password', label: t('accountSettings.password.tab') },
      { value: 'info', label: t('accountSettings.info.tab') },
      { value: 'social', label: t('accountSettings.social.tab') },
      { value: 'skills', label: t('accountSettings.skills.tab') },
      { value: 'career', label: t('accountSettings.career.tab') },
      { value: 'teams', label: t('accountSettings.teams.tab') },
    ],
    [t],
  );

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <TabContext value={activeTab}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
        <Card sx={{ width: { xs: '100%', md: 300 } }}>
          <List disablePadding>
            {tabs.map((tab) => (
              <ListItemButton
                key={tab.value}
                selected={tab.value === activeTab}
                onClick={(event) => handleChange(event, tab.value)}
              >
                <ListItemText primary={tab.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </Card>

        <Stack flex={1} spacing={3} sx={{ width: 1 }}>
          <TabPanel value="general" sx={{ p: 0 }}>
            <GeneralInfoForm />
          </TabPanel>
          <TabPanel value="password" sx={{ p: 0 }}>
            <ChangePasswordForm />
          </TabPanel>
          <TabPanel value="info" sx={{ p: 0 }}>
            <InfoForm />
          </TabPanel>
          <TabPanel value="social" sx={{ p: 0 }}>
            <SocialForm />
          </TabPanel>
          <TabPanel value="skills" sx={{ p: 0 }}>
            <SkillsForm />
          </TabPanel>
          <TabPanel value="career" sx={{ p: 0 }}>
            <CareerForm />
          </TabPanel>
          <TabPanel value="teams" sx={{ p: 0 }}>
            <TeamsPanel />
          </TabPanel>
        </Stack>
      </Stack>
    </TabContext>
  );
};

export default AccountSettingsPage;
