import { useMemo } from 'react';
import { Box, InputAdornment, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import KepIcon from 'shared/components/base/KepIcon';
import { ContestCategoryEntity } from '../../domain/entities/contest.entity';

export type ParticipationFilter = 'all' | 'participated' | 'notParticipated';

export interface ContestFiltersState {
  title: string;
  category: string;
  type: ContestType | '';
  participation: ParticipationFilter;
}

interface ContestFiltersProps {
  filters: ContestFiltersState;
  categories?: ContestCategoryEntity[];
  onChange: (next: ContestFiltersState) => void;
}

const ContestFilters = ({ filters, categories = [], onChange }: ContestFiltersProps) => {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () => categories.map((category) => ({
      value: category.id?.toString() ?? '',
      label: category.title,
      count: category.contestsCount,
    })),
    [categories],
  );

  return (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('contests.filters.searchLabel')}
        </Typography>
        <TextField
          fullWidth
          placeholder={t('contests.filters.searchPlaceholder')}
          value={filters.title}
          onChange={(event) => onChange({ ...filters, title: event.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KepIcon name="search" fontSize={18} style={{ color: 'var(--mui-palette-text-secondary)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('contests.filters.category')}
          </Typography>
          <Select
            fullWidth
            size="small"
            value={filters.category}
            displayEmpty
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                {t('contests.filters.allCategories')}
              </Typography>
            </MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category.value} value={category.value} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2">{category.label}</Typography>
                {category.count ? (
                  <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                    {category.count}
                  </Typography>
                ) : null}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('contests.filters.type')}
          </Typography>
          <Select
            fullWidth
            size="small"
            value={filters.type}
            displayEmpty
            onChange={(event) => onChange({ ...filters, type: event.target.value as ContestType | '' })}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                {t('contests.filters.allTypes')}
              </Typography>
            </MenuItem>
            {Object.values(ContestType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>

      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('contests.filters.participation')}
        </Typography>
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={filters.participation}
          onChange={(_, value) => value && onChange({ ...filters, participation: value })}
        >
          <ToggleButton value="all">{t('contests.filters.statusAll')}</ToggleButton>
          <ToggleButton value="participated">{t('contests.filters.statusParticipated')}</ToggleButton>
          <ToggleButton value="notParticipated">{t('contests.filters.statusNotParticipated')}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
};

export default ContestFilters;
