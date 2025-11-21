import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Divider, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import type { UserAboutData } from 'modules/users/domain/entities/userProfile.entity';
import { UserDetails } from 'modules/users/domain/entities/user.entity';
import { fDate } from 'shared/lib/date';

interface UserAboutTabProps {
  username: string;
  aboutData?: UserAboutData | null;
  isLoading?: boolean;
  userDetails?: UserDetails;
}

const SectionWrapper = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack direction="column" spacing={1}>
    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
      {title}
    </Typography>
    {children}
  </Stack>
);

const TimelineList = ({
  items,
  emptyLabel,
}: {
  items?: UserAboutData['educations'];
  emptyLabel: string;
}) => {
  if (!items?.length) {
    return <Typography color="text.secondary">{emptyLabel}</Typography>;
  }

  return (
    <Stack direction="column" spacing={1.5}>
      {items.map((item, index) => (
        <Stack key={`${item.organization}-${index}`} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Stack direction="column" spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              {item.organization}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.degree}
            </Typography>
            {(item.fromYear || item.toYear) && (
              <Typography variant="caption" color="text.secondary">
                {[item.fromYear, item.toYear].filter(Boolean).join(' - ')}
              </Typography>
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const SkillsList = ({ skills }: { skills?: UserAboutData['skills'] }) => {
  const { t } = useTranslation();

  const entries = useMemo(
    () =>
      [
        { key: 'algorithms', label: t('users.profile.skills.algorithms') },
        { key: 'python', label: 'Python' },
        { key: 'webDevelopment', label: t('users.profile.skills.webDevelopment') },
        { key: 'webScraping', label: t('users.profile.skills.webScraping') },
        { key: 'dataScience', label: t('users.profile.skills.dataScience') },
      ] as const,
    [t],
  );

  const hasAny = entries.some(({ key }) => (skills as any)?.[key]);

  if (!hasAny) {
    return <Typography color="text.secondary">{t('users.profile.skills.empty')}</Typography>;
  }

  return (
    <Stack direction="column" spacing={1.5}>
      {entries.map(({ key, label }) => {
        const value = (skills as any)?.[key];
        if (!value && value !== 0) return null;

        return (
          <Stack key={key} direction="column" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <LinearProgress variant="determinate" value={Number(value)} />
          </Stack>
        );
      })}
    </Stack>
  );
};

const TechnologiesList = ({ technologies }: { technologies?: UserAboutData['technologies'] }) => {
  const { t } = useTranslation();
  if (!technologies?.length) {
    return <Typography color="text.secondary">{t('users.profile.technologies.empty')}</Typography>;
  }

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {technologies.map((technology) => (
        <Chip
          key={technology.text}
          label={technology.text}
          icon={technology.devIconClass ? <Box component="i" className={technology.devIconClass} /> : undefined}
          sx={{
            backgroundColor: technology.badgeColor || 'primary.lighter',
            color: 'primary.darker',
          }}
        />
      ))}
    </Stack>
  );
};

const SocialList = ({ aboutData }: { aboutData?: UserAboutData | null }) => {
  const { t } = useTranslation();
  const socials = [
    { label: t('users.profile.social.telegram'), value: aboutData?.social?.telegram },
    { label: t('users.profile.social.codeforces'), value: aboutData?.social?.codeforcesHandle },
    { label: t('users.profile.social.codeforcesBadge'), value: aboutData?.social?.codeforcesBadge },
  ];

  const hasSocial = socials.some((item) => item.value);

  if (!hasSocial) {
    return <Typography color="text.secondary">{t('users.profile.social.empty')}</Typography>;
  }

  return (
    <Stack direction="column" spacing={0.5}>
      {socials.map((item) => (
        <Typography key={item.label} variant="body2">
          <Typography component="span" variant="body2" color="text.secondary" mr={1}>
            {item.label}:
          </Typography>
          {item.value ?? '—'}
        </Typography>
      ))}
    </Stack>
  );
};

const InfoSummary = ({ aboutData, userDetails }: { aboutData?: UserAboutData | null; userDetails?: UserDetails }) => {
  const { t } = useTranslation();
  const items = useMemo(
    () =>
      [
        { label: t('users.profile.info.country'), value: aboutData?.info?.country ?? userDetails?.country },
        { label: t('users.profile.info.region'), value: aboutData?.info?.region },
        { label: t('users.profile.info.website'), value: aboutData?.info?.website },
        { label: t('users.profile.info.email'), value: aboutData?.info?.email },
        {
          label: t('users.profile.info.joined'),
          value: aboutData?.info?.dateJoined ? fDate(aboutData.info.dateJoined) : undefined,
        },
        {
          label: t('users.profile.info.birthdate'),
          value: aboutData?.info?.dateOfBirth ? fDate(aboutData.info.dateOfBirth) : undefined,
        },
      ],
    [aboutData, t, userDetails?.country],
  );

  return (
    <Stack direction="column" spacing={1}>
      {items.map((item) => (
        <Stack key={item.label} direction="row" spacing={1} justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="body2" textAlign="right">
            {item.value ?? '—'}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const UserAboutTab = ({ username, aboutData, isLoading, userDetails }: UserAboutTabProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <Skeleton variant="rounded" height={480} />;
  }

  return (
    <Stack direction="column" spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.title', { username })}
          </Typography>

          {aboutData?.info?.bio && <Typography>{aboutData.info.bio}</Typography>}

          <InfoSummary aboutData={aboutData} userDetails={userDetails} />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="column" spacing={2}>
          <SectionWrapper title={t('users.profile.skills.title')}>
            <SkillsList skills={aboutData?.skills} />
          </SectionWrapper>

          <Divider />

          <SectionWrapper title={t('users.profile.technologies.title')}>
            <TechnologiesList technologies={aboutData?.technologies} />
          </SectionWrapper>

          <Divider />

          <SectionWrapper title={t('users.profile.education.title')}>
            <TimelineList items={aboutData?.educations} emptyLabel={t('users.profile.education.empty')} />
          </SectionWrapper>

          <Divider />

          <SectionWrapper title={t('users.profile.work.title')}>
            <TimelineList items={aboutData?.workExperiences} emptyLabel={t('users.profile.work.empty')} />
          </SectionWrapper>

          <Divider />

          <SectionWrapper title={t('users.profile.social.title')}>
            <SocialList aboutData={aboutData} />
          </SectionWrapper>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default UserAboutTab;
