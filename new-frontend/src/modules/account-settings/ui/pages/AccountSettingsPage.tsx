import { SyntheticEvent, useMemo, useState } from 'react';
import { TabContext } from '@mui/lab';
import { Alert, Button, Container, Drawer, Paper, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AccountTabPanel from '../components/AccountTabPanel';
import CareerSection from '../components/CareerSection';
import GeneralSettingsForm from '../components/GeneralSettingsForm';
import PasswordForm from '../components/PasswordForm';
import ProfileInformationForm from '../components/ProfileInformationForm';
import SideTabList from '../components/SideTabList';
import SkillsForm from '../components/SkillsForm';
import SocialLinksForm from '../components/SocialLinksForm';
import SystemSettingsPanel from '../components/SystemSettingsPanel';
import TeamsSection from '../components/TeamsSection';
import TechnologiesForm from '../components/TechnologiesForm';
import { AccountSettingsTab } from '../components/accountSettingsTabs';

const AccountSettingsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [showTabs, setShowTabs] = useState(false);

  const tabs: AccountSettingsTab[] = useMemo(
    () => [
      {
        id: 1,
        value: 'general',
        label: t('settings.general'),
        icon: 'material-symbols:person-outline',
        panelIcon: 'material-symbols:person-outline',
        render: <GeneralSettingsForm />,
      },
      {
        id: 2,
        value: 'password',
        label: t('settings.changePassword'),
        icon: 'material-symbols:lock-outline',
        panelIcon: 'material-symbols:lock-outline',
        render: <PasswordForm />,
      },
      {
        id: 3,
        value: 'information',
        label: t('settings.information'),
        icon: 'material-symbols:info-outline',
        panelIcon: 'material-symbols:info-outline',
        render: <ProfileInformationForm />,
      },
      {
        id: 4,
        value: 'social',
        label: t('settings.social'),
        icon: 'material-symbols:link',
        panelIcon: 'material-symbols:link',
        render: <SocialLinksForm />,
      },
      {
        id: 5,
        value: 'skills',
        label: t('settings.skills'),
        icon: 'material-symbols:activity',
        panelIcon: 'material-symbols:activity',
        render: (
          <Stack spacing={3}>
            <SkillsForm />
            <TechnologiesForm />
          </Stack>
        ),
      },
      {
        id: 6,
        value: 'career',
        label: t('settings.career'),
        icon: 'material-symbols:trending-up',
        panelIcon: 'material-symbols:trending-up',
        render: <CareerSection />,
      },
      {
        id: 7,
        value: 'teams',
        label: t('settings.teams'),
        icon: 'material-symbols:group-outline',
        panelIcon: 'material-symbols:group-outline',
        render: <TeamsSection />,
      },
      {
        id: 8,
        value: 'system',
        label: t('settings.system'),
        icon: 'material-symbols:settings-outline',
        panelIcon: 'material-symbols:settings-outline',
        render: <SystemSettingsPanel />,
      },
    ],
    [t],
  );

  const handleTabChange = (_: SyntheticEvent, newValue: string) => setActiveTab(newValue);

  if (!currentUser) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info" action={<Button href="/authentication/login">{t('pageTitles.login')}</Button>}>
          {t('settings.loginRequired')}
        </Alert>
      </Container>
    );
  }

  return (
    <TabContext value={activeTab}>
      <Stack spacing={3} direction={downMd ? 'column' : 'row'} alignItems={downMd ? 'stretch' : 'flex-start'}>
        {downMd ? (
          <>
            <Button
              variant="outlined"
              startIcon={<IconifyIcon icon="material-symbols:menu" />}
              onClick={() => setShowTabs(true)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('settings.openNavigation')}
            </Button>
            <Drawer
              open={showTabs}
              anchor="left"
              onClose={() => setShowTabs(false)}
              ModalProps={{ keepMounted: true }}
              PaperProps={{ sx: { width: 320 } }}
            >
              <SideTabList tabs={tabs} onChange={handleTabChange} onTabClick={() => setShowTabs(false)} />
            </Drawer>
          </>
        ) : (
          <Paper
            sx={{
              width: { md: 324, lg: 405 },
              position: 'sticky',
              top: ({ mixins }) => mixins.topbar.default,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            <SideTabList tabs={tabs} onChange={handleTabChange} />
          </Paper>
        )}

        <Paper sx={{ flex: 1 }}>
          <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
            {tabs.map((tab) => (
              <AccountTabPanel
                key={tab.id}
                value={tab.value}
                title={tab.label}
                panelIcon={tab.panelIcon}
                description={tab.description}
              >
                {tab.render}
              </AccountTabPanel>
            ))}
          </Container>
        </Paper>
      </Stack>
    </TabContext>
  );
};

export default AccountSettingsPage;
