import { ReactNode } from 'react';
import { Chip, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUserAbout } from '../../../application/queries';
import { useUserProfileContext } from '../UserProfilePage';

const SkillProgress = ({ label, value }: { label: string; value?: number }) =>
  value ? (
    <Stack direction="column" spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <LinearProgress variant="determinate" value={Math.min(value, 100)} />
    </Stack>
  ) : null;

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {children}
    </Stack>
  </Paper>
);

const UserAboutTab = () => {
  const { username } = useUserProfileContext();
  const { t } = useTranslation();
  const { data, isLoading } = useUserAbout(username);

  const skills = data?.skills;

  return (
    <Stack direction="column" spacing={3}>
      <SectionCard title={t('userProfile.about.bio')}>
        {isLoading ? (
          <Typography color="text.secondary">{t('common.loading')}</Typography>
        ) : data?.info?.bio ? (
          <Typography variant="body1" color="text.secondary">
            {data.info.bio}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('userProfile.about.empty')}
          </Typography>
        )}
      </SectionCard>

      <SectionCard title={t('userProfile.about.skills')}>
        <Stack direction="column" spacing={1.5}>
          <SkillProgress label={t('userProfile.skills.algorithms')} value={skills?.algorithms} />
          <SkillProgress label="Python" value={skills?.python} />
          <SkillProgress label={t('userProfile.skills.webDevelopment')} value={skills?.webDevelopment} />
          <SkillProgress label={t('userProfile.skills.webScraping')} value={skills?.webScraping} />
          <SkillProgress label={t('userProfile.skills.dataScience')} value={skills?.dataScience} />
        </Stack>
      </SectionCard>

      <SectionCard title={t('userProfile.about.technologies')}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {data?.technologies?.length ? (
            data.technologies.map((tech, index) => (
              <Chip key={tech.text ?? index} label={tech.text} color="primary" variant="outlined" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.about.empty')}
            </Typography>
          )}
        </Stack>
      </SectionCard>

      <SectionCard title={t('userProfile.about.education')}>
        <Stack direction="column" spacing={1.5}>
          {data?.educations?.length ? (
            data.educations.map((education, index) => (
              <Stack key={`${education.organization}-${index}`} direction="column" spacing={0.25}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {education.organization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {education.degree}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {education.fromYear} - {education.toYear}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.about.empty')}
            </Typography>
          )}
        </Stack>
      </SectionCard>

      <SectionCard title={t('userProfile.about.experience')}>
        <Stack direction="column" spacing={1.5}>
          {data?.workExperiences?.length ? (
            data.workExperiences.map((experience, index) => (
              <Stack key={`${experience.company}-${index}`} direction="column" spacing={0.25}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {experience.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {experience.jobTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {experience.fromYear} - {experience.toYear}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.about.empty')}
            </Typography>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export default UserAboutTab;
