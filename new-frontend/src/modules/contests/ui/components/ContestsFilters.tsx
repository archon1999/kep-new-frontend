import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ContestCategoryEntity } from '../../domain/entities/contest.entity';

export interface ContestsFilterState {
  title: string;
  category: string;
  type: string;
  isParticipated: string;
}

interface ContestsFiltersProps {
  filters: ContestsFilterState;
  categories: ContestCategoryEntity[];
  onChange: (filters: ContestsFilterState) => void;
}

const ContestsFilters = ({ filters, categories, onChange }: ContestsFiltersProps) => {
  const { t } = useTranslation();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, title: event.target.value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onChange({ ...filters, type: event.target.value });
  };

  const handleParticipationChange = (value: string) => {
    onChange({ ...filters, isParticipated: value });
  };

  const handleCategoryChange = (code: string) => {
    onChange({ ...filters, category: filters.category === code ? '' : code });
  };

  const contestTypes = Object.values(ContestType);

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
      }}
    >
      <TextField
        fullWidth
        value={filters.title}
        onChange={handleInputChange}
        placeholder={t('contests.searchPlaceholder')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconifyIcon icon="mdi:magnify" width={20} />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('contests.filters.category')}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1.5}>
          {categories.map((category) => {
            const isSelected = filters.category === (category.code ?? '');
            return (
              <Chip
                key={category.id ?? category.code}
                label={category.title}
                onClick={() => handleCategoryChange(category.code)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{ borderRadius: 2 }}
              />
            );
          })}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>{t('contests.filters.type')}</InputLabel>
          <Select
            value={filters.type}
            label={t('contests.filters.type')}
            onChange={handleSelectChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>{t('contests.filters.all')}</em>
            </MenuItem>
            {contestTypes.map((contestType) => (
              <MenuItem key={contestType} value={contestType}>
                {contestType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('contests.filters.participation')}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
          <Chip
            label={t('contests.filters.all')}
            onClick={() => handleParticipationChange('')}
            color={filters.isParticipated === '' ? 'primary' : 'default'}
            variant={filters.isParticipated === '' ? 'filled' : 'outlined'}
          />
          <Chip
            label={t('contests.filters.participated')}
            onClick={() => handleParticipationChange('1')}
            color={filters.isParticipated === '1' ? 'primary' : 'default'}
            variant={filters.isParticipated === '1' ? 'filled' : 'outlined'}
          />
          <Chip
            label={t('contests.filters.notParticipated')}
            onClick={() => handleParticipationChange('0')}
            color={filters.isParticipated === '0' ? 'primary' : 'default'}
            variant={filters.isParticipated === '0' ? 'filled' : 'outlined'}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContestsFilters;
