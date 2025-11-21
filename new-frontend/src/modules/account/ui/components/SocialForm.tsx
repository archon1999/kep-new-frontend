import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import { useUpdateUserSocial, useUserSocial } from '../../application/queries';
import type { UserSocial } from '../../domain/entities/account.entity';
import { useSnackbar } from 'notistack';

const SocialForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const { data } = useUserSocial(username);
  const { trigger, isMutating } = useUpdateUserSocial(username);
  const { register, handleSubmit, reset } = useForm<UserSocial>({
    defaultValues: data ?? {
      codeforcesHandle: '',
      codeforcesBadge: '',
      telegram: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (values: UserSocial) => {
    await trigger(values)
      .then(() => enqueueSnackbar(t('accountSettings.saved'), { variant: 'success' }))
      .catch(() => enqueueSnackbar(t('accountSettings.saveError'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard title={t('accountSettings.social.title')} description={t('accountSettings.social.description')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField label={t('accountSettings.fields.codeforcesHandle')} fullWidth {...register('codeforcesHandle')} />
          <TextField label={t('accountSettings.fields.codeforcesBadge')} fullWidth {...register('codeforcesBadge')} />
          <TextField label={t('accountSettings.fields.telegram')} fullWidth {...register('telegram')} />
          <LoadingButton type="submit" variant="contained" loading={isMutating} sx={{ alignSelf: 'flex-start' }}>
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default SocialForm;
