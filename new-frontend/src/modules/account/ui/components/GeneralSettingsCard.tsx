import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { accountQueries, useGeneralInfo } from '../../application/queries.ts';
import { UserGeneralInfo } from '../../domain/entities/account-settings.entity.ts';

interface GeneralSettingsCardProps {
  username?: string;
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const GeneralSettingsCard = ({ username }: GeneralSettingsCardProps) => {
  const { t } = useTranslation();
  const { refreshCurrentUser } = useAuth();
  const { data, mutate, isLoading } = useGeneralInfo(username);
  const [formState, setFormState] = useState<UserGeneralInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFormState({ ...data });
    }
  }, [data]);

  const handleInputChange = (field: keyof UserGeneralInfo) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => (prev ? { ...prev, [field]: event.target.value } : prev));
  };

  const handleFileChange = async (field: 'avatar' | 'coverPhoto', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const value = await readFileAsDataUrl(file);
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const canSave = useMemo(() => !!formState && !saving, [formState, saving]);

  const handleSave = async () => {
    if (!username || !formState) return;
    setSaving(true);
    setError(null);
    try {
      await accountQueries.repository.updateGeneralInfo(username, formState);
      await mutate();
      await refreshCurrentUser();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setFormState(data ? { ...data } : null);

  return (
    <Card>
      <CardHeader title={t('account.general.title')} subheader={t('account.general.subtitle')} />
      <CardContent>
        {isLoading && <Typography variant="body2">{t('loading')}</Typography>}
        {!isLoading && formState && (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={formState.avatar} sx={{ width: 96, height: 96 }} />
                <Box>
                  <Button variant="contained" component="label" size="small">
                    {t('account.general.uploadAvatar')}
                    <input hidden accept="image/*" type="file" onChange={(event) => handleFileChange('avatar', event)} />
                  </Button>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    height: 120,
                    width: 1,
                  }}
                >
                  {formState.coverPhoto ? (
                    <Box component="img" src={formState.coverPhoto} alt={t('account.general.coverAlt')} sx={{ width: 1, height: 1, objectFit: 'cover' }} />
                  ) : (
                    <Stack height={1} alignItems="center" justifyContent="center">
                      <Typography variant="caption">{t('account.general.noCover')}</Typography>
                    </Stack>
                  )}
                </Box>
                <Button variant="outlined" component="label" size="small">
                  {t('account.general.uploadCover')}
                  <input hidden accept="image/*" type="file" onChange={(event) => handleFileChange('coverPhoto', event)} />
                </Button>
              </Stack>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.general.username')}
                  value={formState.username}
                  onChange={handleInputChange('username')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label={t('account.general.email')} value={formState.email} onChange={handleInputChange('email')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.general.firstName')}
                  value={formState.firstName}
                  onChange={handleInputChange('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.general.lastName')}
                  value={formState.lastName}
                  onChange={handleInputChange('lastName')}
                />
              </Grid>
            </Grid>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleReset} disabled={!formState}>
                {t('account.actions.reset')}
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={!canSave}>
                {t('account.actions.save')}
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsCard;
