import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';

const successSounds = ['Default', 'Rick Roll', 'No sound'];
const homeSounds = ['Home-1', 'Home-2', 'Home-3', 'Home-4', 'Home-5', 'Home-6', 'Home-7', 'No sound', 'Random'];

const SystemCard = () => {
  const { t } = useTranslation();
  const [successSound, setSuccessSound] = useState(successSounds[0]);
  const [homeSound, setHomeSound] = useState(homeSounds[0]);

  useEffect(() => {
    const savedSuccess = localStorage.getItem('kep-success-sound');
    const savedHome = localStorage.getItem('kep-home-sound');
    if (savedSuccess) setSuccessSound(savedSuccess);
    if (savedHome) setHomeSound(savedHome);
  }, []);

  const handleSuccessChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSuccessSound(value);
    localStorage.setItem('kep-success-sound', value);
  };

  const handleHomeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setHomeSound(value);
    localStorage.setItem('kep-home-sound', value);
  };

  return (
    <Card>
      <CardHeader title={t('account.system.title')} subheader={t('account.system.subtitle')} />
      <CardContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>{t('account.system.success')}</InputLabel>
            <Select value={successSound} label={t('account.system.success')} onChange={handleSuccessChange}>
              {successSounds.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>{t('account.system.home')}</InputLabel>
            <Select value={homeSound} label={t('account.system.home')} onChange={handleHomeChange}>
              {homeSounds.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
