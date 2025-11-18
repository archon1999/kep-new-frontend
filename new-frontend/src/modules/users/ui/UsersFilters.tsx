import { ChangeEvent } from 'react';
import { Grid2 as Grid, Stack, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

import { CountryOption, UsersListFilters } from '../domain/entities/user.entity';

interface UsersFiltersProps {
  filters: UsersListFilters;
  countries: CountryOption[];
  isLoadingCountries?: boolean;
  onChange: (filters: UsersListFilters) => void;
}

const UsersFilters = ({ filters, countries, isLoadingCountries, onChange }: UsersFiltersProps) => {
  const { t } = useTranslation();

  const handleFieldChange = (field: keyof UsersListFilters) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      if (field === 'ageFrom' || field === 'ageTo') {
        onChange({
          ...filters,
          [field]: value === '' ? undefined : Number(value),
        });
        return;
      }

      onChange({
        ...filters,
        [field]: value,
      });
    };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            fullWidth
            label={t('users.filters.username')}
            value={filters.username ?? ''}
            onChange={handleFieldChange('username')}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            fullWidth
            label={t('users.filters.name')}
            value={filters.firstName ?? ''}
            onChange={handleFieldChange('firstName')}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            select
            fullWidth
            label={t('users.filters.country')}
            value={filters.country ?? ''}
            onChange={handleFieldChange('country')}
            SelectProps={{
              displayEmpty: true,
            }}
            helperText={isLoadingCountries ? t('users.filters.loadingCountries') : undefined}
          >
            <MenuItem value="">—</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code.toLowerCase()}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              type="number"
              label={t('users.filters.age')}
              value={filters.ageFrom ?? ''}
              onChange={handleFieldChange('ageFrom')}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label={t('users.filters.age')}
              value={filters.ageTo ?? ''}
              onChange={handleFieldChange('ageTo')}
              inputProps={{ min: 0 }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UsersFilters;
