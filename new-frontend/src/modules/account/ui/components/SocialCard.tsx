import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, Grid, Stack, TextField } from '@mui/material';
import { accountQueries, useSocial } from '../../application/queries.ts';
import { UserSocial } from '../../domain/entities/account-settings.entity.ts';

interface SocialCardProps {
  username?: string;
}

const SocialCard = ({ username }: SocialCardProps) => {
  const { t } = useTranslation();
  const { data, mutate } = useSocial(username);
  const [formState, setFormState] = useState<UserSocial | null>(null);

  useEffect(() => {
    if (data) setFormState({ ...data });
  }, [data]);

  const handleChange = (field: keyof UserSocial) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => (prev ? { ...prev, [field]: event.target.value } : prev));
  };

  const handleSave = async () => {
    if (!username || !formState) return;
    await accountQueries.repository.updateSocial(username, formState);
    await mutate();
  };

  return (
    <Card>
      <CardHeader title={t('account.social.title')} subheader={t('account.social.subtitle')} />
      <CardContent>
        {formState && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.social.codeforces')}
                  value={formState.codeforcesHandle || ''}
                  onChange={handleChange('codeforcesHandle')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.social.badge')}
                  value={formState.codeforcesBadge || ''}
                  onChange={handleChange('codeforcesBadge')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('account.social.telegram')}
                  value={formState.telegram || ''}
                  onChange={handleChange('telegram')}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleSave} sx={{ alignSelf: 'flex-end' }}>
              {t('account.actions.save')}
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialCard;
