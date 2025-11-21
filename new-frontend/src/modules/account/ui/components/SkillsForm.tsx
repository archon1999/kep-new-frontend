import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Slider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import { useUpdateUserSkills, useUserSkills } from '../../application/queries';
import type { UserSkills } from '../../domain/entities/account.entity';
import { useSnackbar } from 'notistack';

const skillFields: Array<keyof UserSkills> = ['python', 'webDevelopment', 'webScraping', 'algorithms', 'dataScience'];

const SkillsForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const { data } = useUserSkills(username);
  const { trigger, isMutating } = useUpdateUserSkills(username);
  const { control, handleSubmit, reset } = useForm<UserSkills>({
    defaultValues: data ?? {
      python: 0,
      webDevelopment: 0,
      webScraping: 0,
      algorithms: 0,
      dataScience: 0,
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (values: UserSkills) => {
    await trigger(values)
      .then(() => enqueueSnackbar(t('accountSettings.saved'), { variant: 'success' }))
      .catch(() => enqueueSnackbar(t('accountSettings.saveError'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard title={t('accountSettings.skills.title')} description={t('accountSettings.skills.description')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {skillFields.map((field) => (
            <Stack key={field} spacing={1}>
              <Typography variant="subtitle2">{t(`accountSettings.skills.fields.${field}`)}</Typography>
              <Controller
                control={control}
                name={field}
                render={({ field: controllerField }) => (
                  <Slider
                    {...controllerField}
                    value={controllerField.value ?? 0}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="on"
                  />
                )}
              />
            </Stack>
          ))}
          <LoadingButton type="submit" variant="contained" loading={isMutating} sx={{ alignSelf: 'flex-start' }}>
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default SkillsForm;
