import { KeyboardEvent, MouseEvent, ReactNode, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useSWRMutation from 'swr/mutation';
import { useAuth } from 'app/providers/AuthProvider';
import KepcoinValue from './KepcoinValue';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

interface KepcoinSpendConfirmProps {
  value: number;
  purchaseUrl: string;
  requestBody?: Record<string, unknown>;
  onSuccess?: (response: unknown) => void;
  children?: ReactNode;
  disabled?: boolean;
}

const KepcoinSpendConfirm = ({
  value,
  purchaseUrl,
  requestBody = {},
  onSuccess,
  children,
  disabled = false,
}: KepcoinSpendConfirmProps) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, refreshCurrentUser } = useAuth();

  const [open, setOpen] = useState(false);

  const { trigger, isMutating } = useSWRMutation([purchaseUrl, { method: 'post' }], axiosFetcher);

  const formattedValue = useMemo(() => value.toLocaleString(), [value]);
  const userBalance = useMemo(() => currentUser?.kepcoin ?? 0, [currentUser?.kepcoin]);

  const handleTriggerClick = () => {
    if (disabled) return;

    if (userBalance < value) {
      enqueueSnackbar(t('kepcoinSpend.insufficientBalance'), { variant: 'error' });
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    if (!isMutating) {
      setOpen(false);
    }
  };

  const handleTriggerCapture = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    handleTriggerClick();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();

    handleTriggerClick();
  };

  const handleConfirm = async () => {
    try {
      const response = await trigger(requestBody);
      enqueueSnackbar(t('kepcoinSpend.success'), { variant: 'success' });
      onSuccess?.(response);
      await refreshCurrentUser();
      setOpen(false);
    } catch (error: any) {
      const fallbackMessage = t('kepcoinSpend.error');
      const message = error?.response?.data?.message ?? error?.message ?? fallbackMessage;
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <>
      <Box
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClickCapture={handleTriggerCapture}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'inline-flex',
          borderRadius: 1,
          width: 'fit-content',
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto',
          px: children ? 0 : 1,
          py: children ? 0 : 0.75,
        }}
      >
        {children ?? <KepcoinValue value={formattedValue} iconSize={16} textVariant="caption" fontWeight={600} />}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{t('kepcoinSpend.confirmTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>{t('kepcoinSpend.confirmDescription')}</DialogContentText>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.costLabel')}
              </Typography>
              <KepcoinValue value={formattedValue} iconSize={20} textVariant="body2" fontWeight={700} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.balanceLabel')}
              </Typography>
              <KepcoinValue value={userBalance.toLocaleString()} iconSize={20} textVariant="body2" fontWeight={700} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isMutating}>
            {t('kepcoinSpend.cancelAction')}
          </Button>
          <Button onClick={handleConfirm} variant="contained" disabled={isMutating}>
            {t('kepcoinSpend.confirmAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KepcoinSpendConfirm;
