import { LoadingButton } from '@mui/lab';
import { Checkbox, FormControlLabel, Grid2 as Grid, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import { useUpdateUserInfo, useUserInfo } from '../../application/queries';
import type { UserInfo } from '../../domain/entities/account.entity';
import { useSnackbar } from 'notistack';

const InfoForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const { data } = useUserInfo(username);
  const { trigger, isMutating } = useUpdateUserInfo(username);
  const { register, handleSubmit, reset } = useForm<UserInfo>({
    defaultValues: data ?? {
      country: '',
      region: '',
      website: '',
      email: currentUser?.email || '',
      emailVisible: true,
      dateJoined: '',
      dateOfBirth: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        dateJoined: data.dateJoined ? String(data.dateJoined).slice(0, 10) : '',
        dateOfBirth: data.dateOfBirth ? String(data.dateOfBirth).slice(0, 10) : '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: UserInfo) => {
    await trigger(values)
      .then(() => enqueueSnackbar(t('accountSettings.saved'), { variant: 'success' }))
      .catch(() => enqueueSnackbar(t('accountSettings.saveError'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard title={t('accountSettings.info.title')} description={t('accountSettings.info.description')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.country')} fullWidth {...register('country')} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.region')} fullWidth {...register('region')} />
            </Grid>
          </Grid>
          <TextField label={t('accountSettings.fields.website')} fullWidth {...register('website')} />
          <TextField label={t('accountSettings.fields.email')} type="email" fullWidth {...register('email')} />
          <FormControlLabel control={<Checkbox defaultChecked {...register('emailVisible')} />} label={t('accountSettings.fields.emailVisible')} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.dateJoined')} type="date" fullWidth {...register('dateJoined')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label={t('accountSettings.fields.dateOfBirth')} type="date" fullWidth {...register('dateOfBirth')} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
          <TextField
            label={t('accountSettings.fields.bio')}
            fullWidth
            multiline
            minRows={3}
            {...register('bio')}
          />
          <LoadingButton type="submit" variant="contained" loading={isMutating} sx={{ alignSelf: 'flex-start' }}>
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default InfoForm;
