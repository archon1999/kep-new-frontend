import { useMemo } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemTag } from '../../domain/entities/problem.entity.ts';

export interface ProblemsFilterState {
  search: string;
  difficulty?: number;
  tags: number[];
  status?: number;
  favorites: boolean;
  ordering?: string;
}

interface ProblemsFilterPanelProps {
  tags?: ProblemTag[];
  difficulties?: Array<{ value: number; name: string }>;
  value: ProblemsFilterState;
  onChange: (value: ProblemsFilterState) => void;
}

const statusOptions = [
  { value: undefined, labelKey: 'problems.statusAll' },
  { value: 1, labelKey: 'problems.statusSolved' },
  { value: 2, labelKey: 'problems.statusAttempted' },
  { value: 3, labelKey: 'problems.statusNew' },
];

const orderingOptions = [
  { value: undefined, labelKey: 'problems.orderingNewest' },
  { value: '-solved', labelKey: 'problems.orderingPopular' },
  { value: 'difficulty', labelKey: 'problems.orderingDifficulty' },
];

const ProblemsFilterPanel = ({ tags, difficulties, value, onChange }: ProblemsFilterPanelProps) => {
  const { t } = useTranslation();

  const tagOptions = useMemo(
    () => (tags ?? []).map((tag) => ({ label: tag.name, value: tag.id })),
    [tags],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Stack spacing={0.5} direction="column">
            <Typography variant="h6">{t('problems.filtersTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.filtersSubtitle')}
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            label={t('problems.searchLabel')}
            placeholder={t('problems.searchPlaceholder')}
            value={value.search}
            onChange={(event) => onChange({ ...value, search: event.target.value })}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('problems.difficulty')}</InputLabel>
              <Select
                label={t('problems.difficulty')}
                value={value.difficulty ?? ''}
                onChange={(event) =>
                  onChange({ ...value, difficulty: event.target.value === '' ? undefined : Number(event.target.value) })
                }
              >
                <MenuItem value="">{t('problems.anyDifficulty')}</MenuItem>
                {(difficulties ?? []).map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('problems.status')}</InputLabel>
              <Select
                label={t('problems.status')}
                value={value.status ?? ''}
                onChange={(event) =>
                  onChange({ ...value, status: event.target.value === '' ? undefined : Number(event.target.value) })
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.labelKey} value={option.value ?? ''}>
                    {t(option.labelKey)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Autocomplete
            multiple
            options={tagOptions}
            value={tagOptions.filter((tag) => value.tags.includes(tag.value))}
            onChange={(_, newValue) => onChange({ ...value, tags: newValue.map((tag) => tag.value) })}
            getOptionLabel={(option) => option.label}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option.value} label={option.label} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('problems.tags')}
                placeholder={t('problems.tagsPlaceholder')}
                size="small"
              />
            )}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl fullWidth size="small">
              <InputLabel>{t('problems.ordering')}</InputLabel>
              <Select
                label={t('problems.ordering')}
                value={value.ordering ?? ''}
                onChange={(event) =>
                  onChange({ ...value, ordering: event.target.value === '' ? undefined : String(event.target.value) })
                }
              >
                {orderingOptions.map((option) => (
                  <MenuItem key={option.labelKey} value={option.value ?? ''}>
                    {t(option.labelKey)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box flexShrink={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.favorites}
                    onChange={(event) => onChange({ ...value, favorites: event.target.checked })}
                  />
                }
                label={t('problems.favoritesOnly')}
              />
            </Box>
          </Stack>

          <Box display="flex" justifyContent="flex-end">
            <Button onClick={() => onChange({ search: '', tags: [], favorites: false })}>
              {t('problems.clearFilters')}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsFilterPanel;
