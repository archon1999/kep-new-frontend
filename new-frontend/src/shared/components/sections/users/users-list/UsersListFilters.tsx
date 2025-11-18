import { ChangeEvent, useMemo } from 'react';
import { Grid, MenuItem, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserListItem } from 'app/types/users';
import StyledTextField from 'shared/components/styled/StyledTextField';

export interface UserListFiltersState {
  username: string;
  name: string;
  country: string;
  ageFrom?: number;
  ageTo?: number;
}

interface UsersListFiltersProps {
  filters: UserListFiltersState;
  onChange: (filters: UserListFiltersState) => void;
  data: UserListItem[];
}

const UsersListFilters = ({ filters, onChange, data }: UsersListFiltersProps) => {
  const { t } = useTranslation();

  const countries = useMemo(
    () =>
      Array.from(
        data
          .reduce((map, user) => map.set(user.country, user.countryName), new Map<string, string>())
          .entries(),
      ).map(([code, label]) => ({ code, label })),
    [data],
  );

  const handleChange = (key: keyof UserListFiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = key === 'ageFrom' || key === 'ageTo' ? Number(value) || undefined : value;

    onChange({
      ...filters,
      [key]: parsedValue,
    });
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledTextField
            fullWidth
            label={t('Username')}
            placeholder={t('Username')}
            value={filters.username}
            onChange={handleChange('username')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledTextField
            fullWidth
            label={t('FirstName')}
            placeholder={t('FirstName')}
            value={filters.name}
            onChange={handleChange('name')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledTextField
            select
            fullWidth
            label={t('Country')}
            placeholder={t('Country')}
            value={filters.country}
            onChange={handleChange('country')}
          >
            <MenuItem value="">-</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code} sx={{ textTransform: 'capitalize' }}>
                {country.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              fullWidth
              type="number"
              label={t('Age')}
              placeholder={t('Age')}
              value={filters.ageFrom ?? ''}
              onChange={handleChange('ageFrom')}
              disabledSpinButton
            />
            <StyledTextField
              fullWidth
              type="number"
              label=""
              aria-label={t('Age') ?? 'Age to'}
              placeholder={t('Age')}
              value={filters.ageTo ?? ''}
              onChange={handleChange('ageTo')}
              disabledSpinButton
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UsersListFilters;
