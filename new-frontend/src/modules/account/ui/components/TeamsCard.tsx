import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import { accountQueries, useTeams } from '../../application/queries.ts';
import { Team } from '../../domain/entities/account-settings.entity.ts';

const TeamsCard = () => {
  const { t } = useTranslation();
  const { data, mutate } = useTeams();
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const createTeam = async () => {
    await accountQueries.repository.createTeam(teamName);
    setTeamName('');
    setStatus(t('account.teams.created'));
    await mutate();
  };

  const joinTeam = async () => {
    await accountQueries.repository.joinTeam(teamCode);
    setTeamCode('');
    setStatus(t('account.teams.joined'));
    await mutate();
  };

  const refreshCode = async (code: string) => {
    await accountQueries.repository.refreshTeamCode(code);
    await mutate();
  };

  return (
    <Card>
      <CardHeader title={t('account.teams.title')} subheader={t('account.teams.subtitle')} />
      <CardContent>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={t('account.teams.teamName')} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <Button variant="contained" onClick={createTeam} disabled={!teamName}>
                {t('account.teams.create')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={t('account.teams.teamCode')} value={teamCode} onChange={(e) => setTeamCode(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <Button variant="outlined" onClick={joinTeam} disabled={!teamCode}>
                {t('account.teams.join')}
              </Button>
            </Grid>
          </Grid>

          {status && (
            <Typography variant="body2" color="text.secondary">
              {status}
            </Typography>
          )}

          <Stack spacing={2}>
            {data?.map((team: Team) => (
              <Box
                key={team.id}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <KepIcon name="users" />
                    <Box>
                      <Typography variant="subtitle1">{team.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('account.teams.members', { count: team.members?.length ?? 0 })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('account.teams.codeLabel', { code: team.code })}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button variant="text" onClick={() => refreshCode(team.code)}>
                    {t('account.teams.refresh')}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TeamsCard;
