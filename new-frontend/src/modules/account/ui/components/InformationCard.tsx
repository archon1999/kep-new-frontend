import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { accountQueries, useInformation } from '../../application/queries.ts';
import { UserInfo } from '../../domain/entities/account-settings.entity.ts';

interface InformationCardProps {
  username?: string;
}

const InformationCard = ({ username }: InformationCardProps) => {
  const { t } = useTranslation();
  const { data, mutate } = useInformation(username);
  const [formState, setFormState] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (data) {
      setFormState({ ...data });
    }
  }, [data]);

  const handleChange = (field: keyof UserInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'emailVisible' ? event.target.checked : event.target.value;
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!username || !formState) return;
    await accountQueries.repository.updateInformation(username, formState);
    await mutate();
  };

  return (
    <Card>
      <CardHeader title={t('account.info.title')} subheader={t('account.info.subtitle')} />
      <CardContent>
        {formState && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.info.country')}
                  value={formState.country || ''}
                  onChange={handleChange('country')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.info.region')}
                  value={formState.region || ''}
                  onChange={handleChange('region')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.info.website')}
                  value={formState.website || ''}
                  onChange={handleChange('website')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.info.email')}
                  value={formState.email || ''}
                  onChange={handleChange('email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('account.info.birthdate')}
                  InputLabelProps={{ shrink: true }}
                  value={formState.dateOfBirth ? String(formState.dateOfBirth).slice(0, 10) : ''}
                  onChange={handleChange('dateOfBirth')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label={t('account.info.bio')}
                  value={formState.bio || ''}
                  onChange={handleChange('bio')}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Switch checked={!!formState.emailVisible} onChange={handleChange('emailVisible')} />}
              label={t('account.info.emailVisible')}
            />
            <Button variant="contained" onClick={handleSave} sx={{ alignSelf: 'flex-end' }}>
              {t('account.actions.save')}
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default InformationCard;
