import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ChallengesListContainer from '../components/ChallengesListContainer';

const ChallengesPage = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" height={1} spacing={4}>
      <PageHeader
        title={t('challenges.title')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('menu.practice'), active: false },
          { label: t('menu.challenges'), active: true },
        ]}
      />

      <Box sx={{ flex: 1, px: { xs: 3, md: 5 } }}>
        <ChallengesListContainer />
      </Box>
    </Stack>
  );
};

export default ChallengesPage;
