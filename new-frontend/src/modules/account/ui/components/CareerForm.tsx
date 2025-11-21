import { LoadingButton } from '@mui/lab';
import { Button, Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useAuth } from 'app/providers/AuthProvider';
import AccountSectionCard from './AccountSectionCard';
import {
  useUpdateUserEducations,
  useUpdateUserTechnologies,
  useUpdateUserWorkExperiences,
  useUserEducations,
  useUserTechnologies,
  useUserWorkExperiences,
} from '../../application/queries';
import type { UserEducation, UserTechnology, UserWorkExperience } from '../../domain/entities/account.entity';
import { useSnackbar } from 'notistack';

interface CareerFormValues {
  technologies: UserTechnology[];
  educations: UserEducation[];
  work: UserWorkExperience[];
}

const CareerForm = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data: technologies } = useUserTechnologies(username);
  const { data: educations } = useUserEducations(username);
  const { data: workExperiences } = useUserWorkExperiences(username);

  const { trigger: saveTechnologies, isMutating: savingTechnologies } = useUpdateUserTechnologies(username);
  const { trigger: saveEducations, isMutating: savingEducations } = useUpdateUserEducations(username);
  const { trigger: saveWork, isMutating: savingWork } = useUpdateUserWorkExperiences(username);

  const { control, handleSubmit, reset } = useForm<CareerFormValues>({
    defaultValues: {
      technologies: technologies ?? [],
      educations: educations ?? [],
      work: workExperiences ?? [],
    },
  });

  const { fields: technologyFields, append: appendTechnology, remove: removeTechnology } = useFieldArray({
    control,
    name: 'technologies',
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'educations',
  });

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control,
    name: 'work',
  });

  useEffect(() => {
    reset({
      technologies: technologies ?? [],
      educations: educations ?? [],
      work: workExperiences ?? [],
    });
  }, [educations, reset, technologies, workExperiences]);

  const onSubmit = async (values: CareerFormValues) => {
    await Promise.all([
      saveTechnologies(values.technologies),
      saveEducations(values.educations),
      saveWork(values.work),
    ])
      .then(() => enqueueSnackbar(t('accountSettings.saved'), { variant: 'success' }))
      .catch(() => enqueueSnackbar(t('accountSettings.saveError'), { variant: 'error' }));
  };

  return (
    <AccountSectionCard title={t('accountSettings.career.title')} description={t('accountSettings.career.description')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{t('accountSettings.career.technologies')}</Typography>
              <Button variant="outlined" onClick={() => appendTechnology({ text: '', badgeColor: '#6161ff', devIconClass: '' })}>
                {t('accountSettings.actions.add')}
              </Button>
            </Stack>
            <Stack spacing={2}>
              {technologyFields.map((field, index) => (
                <Stack key={field.id} spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start">
                  <Controller
                    control={control}
                    name={`technologies.${index}.text`}
                    render={({ field: controllerField }) => (
                      <TextField label={t('accountSettings.fields.technologyName')} fullWidth {...controllerField} />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`technologies.${index}.devIconClass`}
                    render={({ field: controllerField }) => (
                      <TextField label={t('accountSettings.fields.technologyIcon')} fullWidth {...controllerField} />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`technologies.${index}.badgeColor`}
                    render={({ field: controllerField }) => (
                      <TextField label={t('accountSettings.fields.technologyColor')} fullWidth {...controllerField} />
                    )}
                  />
                  <Button color="error" onClick={() => removeTechnology(index)}>
                    {t('accountSettings.actions.remove')}
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{t('accountSettings.career.education')}</Typography>
              <Button variant="outlined" onClick={() => appendEducation({ organization: '', degree: '', fromYear: new Date().getFullYear(), toYear: new Date().getFullYear() })}>
                {t('accountSettings.actions.add')}
              </Button>
            </Stack>
            <Stack spacing={2}>
              {educationFields.map((field, index) => (
                <Grid container spacing={2} key={field.id} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      control={control}
                      name={`educations.${index}.organization`}
                      render={({ field: controllerField }) => (
                        <TextField label={t('accountSettings.fields.organization')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      control={control}
                      name={`educations.${index}.degree`}
                      render={({ field: controllerField }) => (
                        <TextField label={t('accountSettings.fields.degree')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Controller
                      control={control}
                      name={`educations.${index}.fromYear`}
                      render={({ field: controllerField }) => (
                        <TextField type="number" label={t('accountSettings.fields.fromYear')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Controller
                      control={control}
                      name={`educations.${index}.toYear`}
                      render={({ field: controllerField }) => (
                        <TextField type="number" label={t('accountSettings.fields.toYear')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 1 }}>
                    <Button color="error" onClick={() => removeEducation(index)}>
                      {t('accountSettings.actions.remove')}
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{t('accountSettings.career.work')}</Typography>
              <Button variant="outlined" onClick={() => appendWork({ company: '', jobTitle: '', fromYear: new Date().getFullYear(), toYear: new Date().getFullYear() })}>
                {t('accountSettings.actions.add')}
              </Button>
            </Stack>
            <Stack spacing={2}>
              {workFields.map((field, index) => (
                <Grid container spacing={2} key={field.id} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      control={control}
                      name={`work.${index}.company`}
                      render={({ field: controllerField }) => (
                        <TextField label={t('accountSettings.fields.company')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      control={control}
                      name={`work.${index}.jobTitle`}
                      render={({ field: controllerField }) => (
                        <TextField label={t('accountSettings.fields.jobTitle')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Controller
                      control={control}
                      name={`work.${index}.fromYear`}
                      render={({ field: controllerField }) => (
                        <TextField type="number" label={t('accountSettings.fields.fromYear')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Controller
                      control={control}
                      name={`work.${index}.toYear`}
                      render={({ field: controllerField }) => (
                        <TextField type="number" label={t('accountSettings.fields.toYear')} fullWidth {...controllerField} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 1 }}>
                    <Button color="error" onClick={() => removeWork(index)}>
                      {t('accountSettings.actions.remove')}
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={savingTechnologies || savingEducations || savingWork}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('accountSettings.actions.save')}
          </LoadingButton>
        </Stack>
      </form>
    </AccountSectionCard>
  );
};

export default CareerForm;
