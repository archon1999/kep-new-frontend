import { useMemo, useState } from 'react';
import { Box, Button, Divider, Popover, Stack, Typography, paperClasses } from '@mui/material';
import { Link } from 'react-router';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import paths from 'app/routes/paths';
import { apiClient } from 'shared/api';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import type {
  ApiMyKepcoinListResult,
  ApiTodayKepcoinListResult,
} from 'shared/api/orval/generated/endpoints';
import useSWR from 'swr';

interface KepcoinMenuProps {
  type?: 'default' | 'slim';
}

const KepcoinMenu = ({ type = 'default' }: KepcoinMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { data: balance } = useSWR<ApiMyKepcoinListResult>('kepcoin-balance', () =>
    apiClient.apiMyKepcoinList(),
  );
  const { data: todayKepcoin } = useSWR<ApiTodayKepcoinListResult>(
    anchorEl ? 'today-kepcoin' : null,
    () => apiClient.apiTodayKepcoinList(),
  );

  const open = Boolean(anchorEl);

  const kepcoinValue = useMemo(() => balance?.kepcoin ?? 0, [balance?.kepcoin]);
  const earnedToday = useMemo(() => todayKepcoin?.earn ?? 0, [todayKepcoin?.earn]);
  const spentToday = useMemo(() => todayKepcoin?.spend ?? 0, [todayKepcoin?.spend]);

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          px: 1,
          height: 48,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            component="img"
            src={kepcoinImage}
            alt="Kepcoin"
            sx={{ width: type === 'slim' ? 26 : 32, height: type === 'slim' ? 26 : 32 }}
          />
          <Stack spacing={0.25} alignItems="flex-start">
            <Typography variant="caption" color="text.secondary">
              Kepcoin
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {kepcoinValue.toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="kepcoin-menu"
        open={open}
        onClose={() => setAnchorEl(null)}
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
            width: 320,
            p: 2,
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              Bugungi kepcoinlar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bugun topilgan va sarflangan kepcoinlaringiz.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Topilgan
              </Typography>
              <Typography variant="body2" fontWeight={700} color="success.main">
                +{earnedToday.toLocaleString()}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Sarflangan
              </Typography>
              <Typography variant="body2" fontWeight={700} color="error.main">
                -{spentToday.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Button component={Link} to={paths.kepcoin} variant="contained" color="primary" fullWidth>
            Kepcoin sahifasiga o&apos;tish
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default KepcoinMenu;
