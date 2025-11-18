import { Button, Paper, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { UsersListContainer } from 'shared/components/sections/users/users-list';
import paths, { rootPaths } from 'app/routes/paths';
import KepIcon from 'shared/components/base/KepIcon';

const UsersListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" height={1} spacing={3}>
      <PageHeader
        title={t('UsersListTitle') ?? 'Users list'}
        breadcrumb={[
          { label: t('home'), url: rootPaths.root },
          { label: t('Menu.Users') ?? t('Users'), url: paths.usersList },
          { label: t('UsersListTitle') ?? 'Users list', active: true },
        ]}
        actionComponent={
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <Button variant="soft" color="neutral" startIcon={<KepIcon name="import" fontSize={18} />}>
              {t('Import') ?? 'Import'}
            </Button>
            <Button variant="soft" color="neutral" startIcon={<KepIcon name="export" fontSize={18} />}>
              {t('Export') ?? 'Export'}
            </Button>
            <Button variant="contained" color="primary" startIcon={<KepIcon name="users" fontSize={18} />}>
              {t('InviteUsers') ?? 'Invite users'}
            </Button>
          </Stack>
        }
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <UsersListContainer />
      </Paper>
    </Stack>
  );
};

export default UsersListPage;
