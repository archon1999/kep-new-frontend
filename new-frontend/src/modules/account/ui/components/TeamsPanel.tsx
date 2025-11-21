import { LoadingButton } from '@mui/lab';
import { Button, Card, CardContent, CardHeader, Divider, Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useRefreshTeamCode, useTeams, useCreateTeam, useJoinTeam } from '../../application/queries';

interface CreateTeamForm {
  name: string;
}

interface JoinTeamForm {
  code: string;
}

const TeamsPanel = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: teams, mutate } = useTeams();
  const { trigger: createTeam, isMutating: creating } = useCreateTeam();
  const { trigger: joinTeam, isMutating: joining } = useJoinTeam();
  const { trigger: refreshCode, isMutating: refreshing } = useRefreshTeamCode();
  const createForm = useForm<CreateTeamForm>({ defaultValues: { name: '' } });
  const joinForm = useForm<JoinTeamForm>({ defaultValues: { code: '' } });

  const handleCreate = async (values: CreateTeamForm) => {
    await createTeam(values.name)
      .then(() => {
        enqueueSnackbar(t('accountSettings.teams.created'), { variant: 'success' });
        createForm.reset();
        mutate();
      })
      .catch(() => enqueueSnackbar(t('accountSettings.teams.error'), { variant: 'error' }));
  };

  const handleJoin = async (values: JoinTeamForm) => {
    await joinTeam(values.code)
      .then(() => {
        enqueueSnackbar(t('accountSettings.teams.joined'), { variant: 'success' });
        joinForm.reset();
        mutate();
      })
      .catch(() => enqueueSnackbar(t('accountSettings.teams.error'), { variant: 'error' }));
  };

  const handleRefresh = async (code: string) => {
    await refreshCode(code)
      .then(() => {
        enqueueSnackbar(t('accountSettings.teams.refreshed'), { variant: 'success' });
        mutate();
      })
      .catch(() => enqueueSnackbar(t('accountSettings.teams.error'), { variant: 'error' }));
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title={t('accountSettings.teams.title')} subheader={t('accountSettings.teams.description')} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <form onSubmit={createForm.handleSubmit(handleCreate)}>
                <Stack spacing={2}>
                  <TextField label={t('accountSettings.fields.teamName')} fullWidth {...createForm.register('name')} />
                  <LoadingButton type="submit" variant="contained" loading={creating} sx={{ alignSelf: 'flex-start' }}>
                    {t('accountSettings.actions.create')}
                  </LoadingButton>
                </Stack>
              </form>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <form onSubmit={joinForm.handleSubmit(handleJoin)}>
                <Stack spacing={2}>
                  <TextField label={t('accountSettings.fields.teamCode')} fullWidth {...joinForm.register('code')} />
                  <LoadingButton type="submit" variant="outlined" loading={joining} sx={{ alignSelf: 'flex-start' }}>
                    {t('accountSettings.actions.join')}
                  </LoadingButton>
                </Stack>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={t('accountSettings.teams.memberships')} />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            {teams?.map((team) => (
              <Stack key={team.id} direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">{team.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('accountSettings.teams.creator', { username: team.createrUsername })}
                  </Typography>
                  {team.code && (
                    <Typography variant="body2" color="text.secondary">
                      {t('accountSettings.teams.code', { code: team.code })}
                    </Typography>
                  )}
                </Stack>
                {team.code && (
                  <Button variant="text" onClick={() => handleRefresh(team.code || '')} disabled={refreshing}>
                    {t('accountSettings.teams.refreshCode')}
                  </Button>
                )}
              </Stack>
            ))}
            {!teams?.length && <Typography color="text.secondary">{t('accountSettings.teams.empty')}</Typography>}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TeamsPanel;
