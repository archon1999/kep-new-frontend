import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Divider, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useUserEducations, useUserInfo, useUserSkills, useUserTechnologies, useUserWorkExperiences } from 'modules/users/application/queries';

interface UserAboutSectionProps {
  username: string;
}

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (!value) return null;

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
};

const SkillsSection = ({ username }: UserAboutSectionProps) => {
  const { t } = useTranslation();
  const { data: skills, isLoading } = useUserSkills(username);
  const entries = useMemo(
    () =>
      Object.entries(skills ?? {})
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => ({ key, value: Number(value) })),
    [skills],
  );

  if (isLoading) {
    return <Skeleton variant="rectangular" height={120} />;
  }

  if (entries.length === 0) return null;

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle1" fontWeight={700}>
        {t('users.profile.skills')}
      </Typography>

      <Stack direction="column" spacing={1.5}>
        {entries.map(({ key, value }) => (
          <Stack key={key} direction="column" spacing={0.5}>
            <Typography variant="body2" color="text.secondary" textTransform="capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </Typography>
            <LinearProgress variant="determinate" value={Math.min(100, value)} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

const TimelineSection = ({
  title,
  items,
}: {
  title: string;
  items?: { primary?: string; secondary?: string; period?: string }[];
}) => {
  if (!items || items.length === 0) return null;

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>

      <Stack direction="column" spacing={1}>
        {items.map((item, index) => (
          <Paper key={`${item.primary}-${index}`} variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="body2" fontWeight={700}>
                {item.primary}
              </Typography>
              {item.secondary && (
                <Typography variant="body2" color="text.secondary">
                  {item.secondary}
                </Typography>
              )}
              {item.period && (
                <Typography variant="caption" color="text.secondary">
                  {item.period}
                </Typography>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};

const UserAboutSection = ({ username }: UserAboutSectionProps) => {
  const { t } = useTranslation();
  const { data: info, isLoading: isInfoLoading } = useUserInfo(username);
  const { data: technologies, isLoading: isTechnologiesLoading } = useUserTechnologies(username);
  const { data: educations, isLoading: isEducationsLoading } = useUserEducations(username);
  const { data: experiences, isLoading: isExperiencesLoading } = useUserWorkExperiences(username);

  const educationItems = useMemo(
    () =>
      (educations ?? []).map((education) => ({
        primary: education.organization,
        secondary: education.degree,
        period:
          education.fromYear || education.toYear
            ? `${education.fromYear ?? '—'} - ${education.toYear ?? t('users.profile.present')}`
            : undefined,
      })),
    [educations, t],
  );

  const experienceItems = useMemo(
    () =>
      (experiences ?? []).map((experience) => ({
        primary: experience.company,
        secondary: experience.jobTitle,
        period:
          experience.fromYear || experience.toYear
            ? `${experience.fromYear ?? '—'} - ${experience.toYear ?? t('users.profile.present')}`
            : undefined,
      })),
    [experiences, t],
  );

  return (
    <Paper background={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.aboutTitle')}
          </Typography>

          {isInfoLoading ? (
            <Skeleton variant="rectangular" height={160} />
          ) : (
            <Stack direction="column" spacing={1.5}>
              <InfoRow label={t('users.profile.country')} value={info?.country} />
              <InfoRow label={t('users.profile.region')} value={info?.region} />
              <InfoRow label={t('users.profile.email')} value={info?.email} />
              <InfoRow label={t('users.profile.website')} value={info?.website} />
              <InfoRow label={t('users.profile.joined')} value={info?.dateJoined as string} />
              <InfoRow label={t('users.profile.birthDate')} value={info?.dateOfBirth as string} />
              {info?.bio && (
                <Typography variant="body2" color="text.secondary">
                  {info.bio}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        <Divider />

        <SkillsSection username={username} />

        <Divider />

        {isTechnologiesLoading ? (
          <Skeleton variant="rectangular" height={72} />
        ) : technologies && technologies.length > 0 ? (
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('users.profile.technologies')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {technologies.map((tech, index) => (
                <Chip key={`${tech.text}-${index}`} label={tech.text} color="primary" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Divider />

        {isEducationsLoading ? <Skeleton variant="rectangular" height={120} /> : null}
        <TimelineSection title={t('users.profile.education')} items={educationItems} />

        <Divider />

        {isExperiencesLoading ? <Skeleton variant="rectangular" height={120} /> : null}
        <TimelineSection title={t('users.profile.experience')} items={experienceItems} />
      </Stack>
    </Paper>
  );
};

export default UserAboutSection;
