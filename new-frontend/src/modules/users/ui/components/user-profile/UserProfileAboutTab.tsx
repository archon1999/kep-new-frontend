import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useUserAbout } from '../../../application/queries';

const UserProfileAboutTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { data, isLoading } = useUserAbout(username);

  const skills = data?.skills ?? {};
  const technologies = data?.technologies ?? [];
  const educations = data?.educations ?? [];
  const workExperiences = data?.workExperiences ?? [];
  const bio = data?.profileInfo?.bio;

  const skillEntries = useMemo(
    () =>
      Object.entries(skills)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([label, value]) => ({ label, value: Number(value) })),
    [skills],
  );

  if (isLoading) {
    return (
      <Stack direction="column" spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {t('users.profile.about')}
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: bio }}
              variant="body2"
              color="text.secondary"
            />
          </Stack>
        </CardContent>
      </Card>

      {skillEntries.length ? (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.skills')}
              </Typography>

              <Stack direction="column" spacing={1.5}>
                {skillEntries.map((entry) => (
                  <Stack key={entry.label} direction="column" spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {t(`settings.skillLabels.${entry.label}`, { defaultValue: entry.label })}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={entry.value}
                      sx={{ height: 8, borderRadius: 2 }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {technologies.length ? (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.5}>
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.technologies')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {technologies.map((tech) => (
                  <Chip
                    key={`${tech.text}-${tech.devIconClass}`}
                    label={tech.text}
                    sx={{ color: 'white', bgcolor: tech.badgeColor || 'action.hover' }}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {educations.length ? (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.25}>
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.education')}
              </Typography>
              <Stack direction="column" spacing={1}>
                {educations.map((education, index) => (
                  <Stack
                    key={`${education.organization}-${index}`}
                    direction="column"
                    spacing={0.25}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      {education.organization}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {education.degree}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {education.fromYear} - {education.toYear}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {workExperiences.length ? (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={1.25}>
              <Typography variant="h6" fontWeight={700}>
                {t('users.profile.workExperience')}
              </Typography>
              <Stack direction="column" spacing={1}>
                {workExperiences.map((work, index) => (
                  <Stack key={`${work.company}-${index}`} direction="column" spacing={0.25}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {work.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {work.jobTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {work.fromYear} - {work.toYear}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
};

export default UserProfileAboutTab;
