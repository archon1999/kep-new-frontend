import { MouseEvent, useMemo, useState } from 'react';
import { Box, Button, Link, Popover, Skeleton, Stack, Typography, paperClasses } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import paths from 'app/routes/paths';
import { useAuth } from 'app/providers/AuthProvider';
import { TodayKepCoin, type KepCoinBalance } from 'shared/api/orval/generated/endpoints/index.schemas';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { useTranslation } from 'react-i18next';

interface KepcoinMenuProps {
  type?: 'default' | 'slim';
}

const KepcoinMenu = ({ type = 'default' }: KepcoinMenuProps) => {
  const [todayStats, setTodayStats] = useState<TodayKepCoin | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

  const {
    config: { textDirection },
  } = useSettingsContext();
  const { currentUser } = useAuth();
  const { data: fetchedBalance } = useSWR<KepCoinBalance>(['/api/my-kepcoin', { method: 'get' }], axiosFetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const { trigger: fetchTodayStats, isMutating: loadingToday } = useSWRMutation(
    ['/api/today-kepcoin', { method: 'get' }],
    axiosFetcher,
    {
      throwOnError: false,
    },
  );

  const balance = useMemo(() => fetchedBalance?.kepcoin ?? currentUser?.kepcoin ?? null, [
    currentUser?.kepcoin,
    fetchedBalance?.kepcoin,
  ]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    fetchTodayStats()
      .then((data) => setTodayStats(data ?? null))
      .catch(() => setTodayStats(null));
  };

  const open = Boolean(anchorEl);
  const formattedBalance = balance === null ? '--' : balance.toLocaleString();

  return (
    <>
      <Button
        onClick={handleOpen}
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        size="small"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            component="img"
            src={kepcoinImage}
            alt="Kepcoin"
            sx={{ width: type === 'slim' ? 18 : 22, height: type === 'slim' ? 18 : 22 }}
          />
          <Typography variant="body2" fontWeight={600}>
            {formattedBalance}
          </Typography>
        </Stack>
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="kepcoin-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            minWidth: 280,
            p: 0,
          },
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 30, height: 30 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {formattedBalance}
              </Typography>
            </Box>
          </Stack>

          <Button component={Link} href={paths.kepcoin} variant="text" color="primary" onClick={handleClose}>
            {t('kepcoin.menu.goToPage')}
          </Button>
        </Stack>

        {loadingToday ? (
          <Stack spacing={1} padding={2} direction="column">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={104} height={20} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="text" width={32} height={20} />
                <Skeleton variant="circular" width={type === 'slim' ? 18 : 22} height={type === 'slim' ? 18 : 22} />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={110} height={20} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="text" width={32} height={20} />
                <Skeleton variant="circular" width={type === 'slim' ? 18 : 22} height={type === 'slim' ? 18 : 22} />
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} padding={2} direction="column">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoin.menu.todayEarned')}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontWeight={700}>
                  {todayStats ? todayStats.earn : '--'}
                </Typography>
                <Box
                  component="img"
                  src={kepcoinImage}
                  alt="Kepcoin"
                  sx={{ width: type === 'slim' ? 18 : 22, height: type === 'slim' ? 18 : 22 }}
                />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoin.menu.todaySpent')}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontWeight={700}>
                  {todayStats ? todayStats.spend : '--'}
                </Typography>
                <Box
                  component="img"
                  src={kepcoinImage}
                  alt="Kepcoin"
                  sx={{ width: type === 'slim' ? 18 : 22, height: type === 'slim' ? 18 : 22 }}
                />
              </Stack>
            </Stack>
          </Stack>
        )}
      </Popover>
    </>
  );
};

export default KepcoinMenu;
