import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, CardContent, CardHeader, Grid, Slider, Stack, Typography } from '@mui/material';
import { accountQueries, useSkills } from '../../application/queries.ts';
import { UserSkills } from '../../domain/entities/account-settings.entity.ts';

interface SkillsCardProps {
  username?: string;
}

const SKILL_FIELDS: Array<keyof UserSkills> = ['python', 'webDevelopment', 'webScraping', 'algorithms', 'dataScience'];

const SkillsCard = ({ username }: SkillsCardProps) => {
  const { t } = useTranslation();
  const { data, mutate } = useSkills(username);
  const [formState, setFormState] = useState<UserSkills | null>(null);

  useEffect(() => {
    if (data) setFormState({ ...data });
  }, [data]);

  const handleChange = (field: keyof UserSkills) => (_event: Event, value: number | number[]) => {
    setFormState((prev) => (prev ? { ...prev, [field]: Array.isArray(value) ? value[0] : value } : prev));
  };

  const handleSave = async () => {
    if (!username || !formState) return;
    await accountQueries.repository.updateSkills(username, formState);
    await mutate();
  };

  return (
    <Card>
      <CardHeader title={t('account.skills.title')} subheader={t('account.skills.subtitle')} />
      <CardContent>
        {formState && (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {SKILL_FIELDS.map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Typography variant="body2" gutterBottom>
                    {t(`account.skills.${field}`)}
                  </Typography>
                  <Slider
                    value={formState[field] ?? 0}
                    onChange={handleChange(field)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSave}>
                {t('account.actions.save')}
              </Button>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
