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
        actionComponent={<div></div>}
      />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
        <UsersListContainer />
      </Box>
    </Stack>
  );
};

export default UsersListPage;
