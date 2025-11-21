import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import { useChangePassword } from '../../application/queries';
import { useSnackbar } from 'notistack';
import type { ChangePasswordPayload } from '../../domain/entities/account.entity';

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const { trigger, isMutating } = useChangePassword(username);
  const { register, handleSubmit, reset, watch } = useForm<ChangePasswordPayload & { confirmPassword: string }>({
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordPayload & { confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      enqueueSnackbar(t('accountSettings.password.mismatch'), { variant: 'warning' });
      return;
    }

    await trigger({ oldPassword: values.oldPassword, newPassword: values.newPassword })
      .then(() => {
        enqueueSnackbar(t('accountSettings.password.updated'), { variant: 'success' });
        reset();
      })
      .catch(() => enqueueSnackbar(t('accountSettings.password.error'), { variant: 'error' }));
  };

  const newPassword = watch('newPassword');

  return (
    <AccountSectionCard title={t('accountSettings.password.title')} description={t('accountSettings.password.description')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField label={t('accountSettings.fields.oldPassword')} type="password" fullWidth {...register('oldPassword')} />
          <TextField label={t('accountSettings.fields.newPassword')} type="password" fullWidth {...register('newPassword')} />
          <TextField
            label={t('accountSettings.fields.confirmPassword')}
            type="password"
            fullWidth
            error={Boolean(newPassword) && newPassword !== watch('confirmPassword')}
            {...register('confirmPassword')}
          />
          <LoadingButton type="submit" variant="contained" loading={isMutating} sx={{ alignSelf: 'flex-start' }}>
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default ChangePasswordForm;
