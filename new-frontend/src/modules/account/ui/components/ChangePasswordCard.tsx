import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { accountQueries } from '../../application/queries.ts';

interface ChangePasswordCardProps {
  username?: string;
}

const ChangePasswordCard = ({ username }: ChangePasswordCardProps) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!username) return;
    if (newPassword !== confirmPassword) {
      setFeedback(t('account.password.mismatch'));
      return;
    }
    try {
      await accountQueries.repository.changePassword(username, oldPassword, newPassword);
      setFeedback(t('account.password.updated'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFeedback((err as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader title={t('account.password.title')} subheader={t('account.password.subtitle')} />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label={t('account.password.old')}
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            fullWidth
          />
          <TextField
            label={t('account.password.new')}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            fullWidth
          />
          <TextField
            label={t('account.password.confirm')}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            fullWidth
          />
          {feedback && (
            <Typography variant="body2" color="text.secondary">
              {feedback}
            </Typography>
          )}
          <Button variant="contained" onClick={handleSubmit} disabled={!username} sx={{ alignSelf: 'flex-start' }}>
            {t('account.password.change')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
