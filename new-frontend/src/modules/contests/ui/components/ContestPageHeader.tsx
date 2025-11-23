import { ReactNode, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ContestTabs from './ContestTabs';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import Logo from 'shared/components/common/Logo.tsx';
import Image from 'shared/components/base/Image.tsx';

interface ContestPageHeaderProps {
  title: string;
  contest?: ContestDetail | null;
  contestId?: number | string;
  rightContent?: ReactNode;
  tabsRightContent?: ReactNode;
  hideTabs?: boolean;
  isRated?: boolean;
  showLogoOverlay?: boolean;
}

const ContestPageHeader = ({
  title,
  contest,
  contestId,
  rightContent,
  tabsRightContent,
  hideTabs = false,
  isRated,
}: ContestPageHeaderProps) => {
  const resolvedContestId = contest?.id ?? contestId ?? 0;
  const status = contest?.statusCode ?? ContestStatus.Already;
  const rated = contest?.isRated ?? isRated;

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}18, ${theme.palette.info.light}12)`,
      })}
    >
      <Box
        sx={{
          position: 'absolute',
          right: { xs: -24, md: 24 },
          bottom: { xs: -24, md: 8 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Image sx={{ width: 200 }} src={contest?.logo ?? ''}></Image>
      </Box>


      <Stack spacing={2} position="relative" zIndex={1}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
          <Typography variant="h5" fontWeight={800} sx={{ flex: 1, minWidth: 0 }}>
            {title}
          </Typography>
          {rightContent}
        </Stack>

        {!hideTabs ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <ContestTabs contestId={resolvedContestId} status={status} isRated={rated} />
            {tabsRightContent ? (
              <Box sx={{ ml: { md: 'auto' } }}>
                {tabsRightContent}
              </Box>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ContestPageHeader;
