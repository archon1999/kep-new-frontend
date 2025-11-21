import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material';
import { accountQueries, useEducations, useTechnologies, useWorkExperiences } from '../../application/queries.ts';
import { UserEducation, UserTechnology, UserWorkExperience } from '../../domain/entities/account-settings.entity.ts';

interface CareerCardProps {
  username?: string;
}

const defaultTechnology: UserTechnology = { text: '', devIconClass: '', badgeColor: '' };
const defaultEducation: UserEducation = { organization: '', degree: '', fromYear: new Date().getFullYear(), toYear: new Date().getFullYear() };
const defaultWork: UserWorkExperience = { company: '', jobTitle: '', fromYear: new Date().getFullYear(), toYear: new Date().getFullYear() };

const CareerCard = ({ username }: CareerCardProps) => {
  const { t } = useTranslation();
  const { data: techData, mutate: mutateTechnologies } = useTechnologies(username);
  const { data: eduData, mutate: mutateEducation } = useEducations(username);
  const { data: workData, mutate: mutateWork } = useWorkExperiences(username);

  const [technologies, setTechnologies] = useState<UserTechnology[]>([]);
  const [educations, setEducations] = useState<UserEducation[]>([]);
  const [workExperiences, setWorkExperiences] = useState<UserWorkExperience[]>([]);

  useEffect(() => {
    if (techData) setTechnologies([...techData]);
  }, [techData]);

  useEffect(() => {
    if (eduData) setEducations([...eduData]);
  }, [eduData]);

  useEffect(() => {
    if (workData) setWorkExperiences([...workData]);
  }, [workData]);

  const handleTechnologyChange = (index: number, field: keyof UserTechnology, value: string) => {
    setTechnologies((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleEducationChange = (index: number, field: keyof UserEducation, value: string | number) => {
    setEducations((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleWorkChange = (index: number, field: keyof UserWorkExperience, value: string | number) => {
    setWorkExperiences((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const saveAll = async () => {
    if (!username) return;
    await accountQueries.repository.updateTechnologies(username, technologies);
    await accountQueries.repository.updateEducations(username, educations);
    await accountQueries.repository.updateWorkExperiences(username, workExperiences);
    await Promise.all([mutateTechnologies(), mutateEducation(), mutateWork()]);
  };

  return (
    <Card>
      <CardHeader title={t('account.career.title')} subheader={t('account.career.subtitle')} />
      <CardContent>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="h6">{t('account.career.technologies')}</Typography>
            {technologies.map((tech, index) => (
              <Grid container spacing={2} key={`tech-${index}`}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('account.career.techName')}
                    value={tech.text}
                    onChange={(event) => handleTechnologyChange(index, 'text', event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label={t('account.career.devIcon')}
                    value={tech.devIconClass || ''}
                    onChange={(event) => handleTechnologyChange(index, 'devIconClass', event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label={t('account.career.badgeColor')}
                    value={tech.badgeColor || ''}
                    onChange={(event) => handleTechnologyChange(index, 'badgeColor', event.target.value)}
                  />
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" onClick={() => setTechnologies((prev) => [...prev, { ...defaultTechnology }])}>
              {t('account.career.addTechnology')}
            </Button>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6">{t('account.career.education')}</Typography>
            {educations.map((education, index) => (
              <Grid container spacing={2} key={`edu-${index}`}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t('account.career.organization')}
                    value={education.organization}
                    onChange={(event) => handleEducationChange(index, 'organization', event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t('account.career.degree')}
                    value={education.degree}
                    onChange={(event) => handleEducationChange(index, 'degree', event.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('account.career.from')}
                    value={education.fromYear}
                    onChange={(event) => handleEducationChange(index, 'fromYear', Number(event.target.value))}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('account.career.to')}
                    value={education.toYear}
                    onChange={(event) => handleEducationChange(index, 'toYear', Number(event.target.value))}
                  />
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" onClick={() => setEducations((prev) => [...prev, { ...defaultEducation }])}>
              {t('account.career.addEducation')}
            </Button>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6">{t('account.career.work')}</Typography>
            {workExperiences.map((work, index) => (
              <Grid container spacing={2} key={`work-${index}`}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t('account.career.company')}
                    value={work.company}
                    onChange={(event) => handleWorkChange(index, 'company', event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t('account.career.jobTitle')}
                    value={work.jobTitle}
                    onChange={(event) => handleWorkChange(index, 'jobTitle', event.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('account.career.from')}
                    value={work.fromYear}
                    onChange={(event) => handleWorkChange(index, 'fromYear', Number(event.target.value))}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('account.career.to')}
                    value={work.toYear}
                    onChange={(event) => handleWorkChange(index, 'toYear', Number(event.target.value))}
                  />
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" onClick={() => setWorkExperiences((prev) => [...prev, { ...defaultWork }])}>
              {t('account.career.addWork')}
            </Button>
          </Stack>

          <Button variant="contained" onClick={saveAll} sx={{ alignSelf: 'flex-end' }}>
            {t('account.actions.save')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CareerCard;
