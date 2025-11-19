import { useTranslation } from 'react-i18next';
import { Box, Button, Paper, Stack } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import UsersListContainer from './components/UsersListContainer';


const UsersListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" height={1} spacing={4}>
      <PageHeader
        title={t('users.title')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('users.title'), active: true },
        ]}
        actionComponent={
          <Stack gap={1} direction={{ xs: 'column', sm: 'row' }}>
            <Button variant="soft" color="neutral" startIcon={<IconifyIcon icon="mdi:export" fontSize={18} />}>
              {t('users.actions.export')}
            </Button>
            <Button variant="contained" color="primary" startIcon={<IconifyIcon icon="mdi:account-plus-outline" fontSize={18} />}>
              {t('users.actions.invite')}
            </Button>
          </Stack>
        }
      />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
        <UsersListContainer />
      </Box>
    </Stack>
  );
};

export default UsersListPage;
