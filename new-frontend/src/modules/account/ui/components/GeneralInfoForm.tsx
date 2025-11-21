import { LoadingButton } from '@mui/lab';
import { Avatar, Grid2 as Grid, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import { useGeneralInfo, useUpdateGeneralInfo } from '../../application/queries';
import type { UserGeneralInfo } from '../../domain/entities/account.entity';
import { useSnackbar } from 'notistack';

const GeneralInfoForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const { data } = useGeneralInfo(username);
  const { trigger, isMutating } = useUpdateGeneralInfo(username);
  const { register, handleSubmit, reset } = useForm<UserGeneralInfo>({
    defaultValues: data ?? {
      username: username || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (values: UserGeneralInfo) => {
    await trigger(values)
      .then(() => enqueueSnackbar(t('accountSettings.saved'), { variant: 'success' }))
      .catch(() => enqueueSnackbar(t('accountSettings.saveError'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard
      title={t('accountSettings.general.title')}
      description={t('accountSettings.general.description')}
      action={<Avatar src={data?.avatar || currentUser?.avatar} alt={data?.username} sx={{ width: 40, height: 40 }} />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.firstName')} fullWidth {...register('firstName')} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.lastName')} fullWidth {...register('lastName')} />
            </Grid>
          </Grid>
          <TextField label={t('accountSettings.fields.email')} type="email" fullWidth {...register('email')} />
          <LoadingButton type="submit" variant="contained" loading={isMutating} sx={{ alignSelf: 'flex-start' }}>
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default GeneralInfoForm;
