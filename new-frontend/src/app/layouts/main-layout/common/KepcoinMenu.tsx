import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Avatar, Button, Divider, Popover, Stack, Typography, paperClasses } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import paths from 'app/routes/paths';
import { KepCoinBalance, TodayKepCoin } from 'shared/api/orval/generated/endpoints/index.schemas';
import kepcoinImg from 'shared/assets/images/icons/kepcoin.png';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useSWR from 'swr';

type KepcoinMenuProps = {
  type?: 'default' | 'slim';
};

const formatKepcoinValue = (value?: number) => {
  if (value === undefined || value === null) {
    return '…';
  }

  return value.toLocaleString('en-US');
};

const KepcoinMenu = ({ type = 'default' }: KepcoinMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { data: balance } = useSWR<KepCoinBalance>('/api/my-kepcoin');
  const { data: todayKepcoin } = useSWR<TodayKepCoin>(anchorEl ? '/api/today-kepcoin' : null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape={type === 'default' ? 'rounded' : undefined}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleClick}
        sx={{
          px: type === 'slim' ? 1 : 1.5,
          minHeight: 40,
        }}
        startIcon={
          <Avatar
            src={kepcoinImg}
            alt="Kepcoin"
            variant="rounded"
            sx={{
              width: type === 'slim' ? 28 : 32,
              height: type === 'slim' ? 28 : 32,
              bgcolor: 'transparent',
            }}
          />
        }
      >
        <Typography variant="subtitle2" color="text.primary">
          {formatKepcoinValue(balance?.kepcoin)}
        </Typography>
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
            p: 2,
            minWidth: 260,
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={kepcoinImg}
              alt="Kepcoin"
              variant="rounded"
              sx={{ width: 36, height: 36, bgcolor: 'transparent' }}
            />
            <Typography variant="subtitle1">Bugungi kepcoinlar</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary">Topilgan</Typography>
            <Typography fontWeight={600}>{formatKepcoinValue(todayKepcoin?.earn ?? 0)}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary">Sarflangan</Typography>
            <Typography fontWeight={600}>{formatKepcoinValue(todayKepcoin?.spend ?? 0)}</Typography>
          </Stack>

          <Divider />

          <Button
            component={RouterLink}
            to={paths.kepcoin}
            variant="contained"
            color="primary"
            endIcon={<IconifyIcon icon="material-symbols:arrow-forward-rounded" />}
            onClick={handleClose}
          >
            Kepcoin sahifasiga o&apos;tish
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default KepcoinMenu;
