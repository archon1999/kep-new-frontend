import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProblemCategory, ProblemsListParams } from '../../domain';

interface Props {
  filter: ProblemsListParams;
  onChange: (value: Partial<ProblemsListParams>) => void;
  categories?: ProblemCategory[];
  difficulties?: Array<{ name: string; value: number }>;
  languages?: Array<{ value: string; label: string }>;
  problemCount?: number;
}

const statusOptions = [
  { value: null, label: 'problems.filter.status.all' },
  { value: 1, label: 'problems.filter.status.solved' },
  { value: 2, label: 'problems.filter.status.attempted' },
  { value: 3, label: 'problems.filter.status.unsolved' },
];

const orderingOptions = [
  { value: '-id', label: 'problems.filter.ordering.newest' },
  { value: 'id', label: 'problems.filter.ordering.oldest' },
  { value: 'difficulty,-solved', label: 'problems.filter.ordering.easier' },
  { value: '-difficulty,solved', label: 'problems.filter.ordering.harder' },
  { value: '-solved', label: 'problems.filter.ordering.mostSolved' },
  { value: 'solved', label: 'problems.filter.ordering.leastSolved' },
];

const ProblemsFilter = ({
  filter,
  onChange,
  categories = [],
  difficulties = [],
  languages = [],
  problemCount = 0,
}: Props) => {
  const { t } = useTranslation();

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        category.tags.map((tag) => ({ ...tag, categoryTitle: category.title })),
      ),
    [categories],
  );

  const selectedTags = tags.filter((tag) => filter.tags?.includes(tag.id));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} direction="column">
          <Stack spacing={0.5} direction="column">
            <Typography variant="h6" fontWeight={800}>
              {t('problems.filter.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.filter.subtitle', { count: problemCount })}
            </Typography>
          </Stack>

          <Stack spacing={2} direction="column">
            <TextField
              label={t('problems.filter.search')}
              value={filter.search ?? ''}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder={t('problems.filter.searchPlaceholder')}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.filter.category')}</InputLabel>
                  <Select
                    label={t('problems.filter.category')}
                    value={filter.category ?? ''}
                    onChange={(event) =>
                      onChange({ category: event.target.value ? Number(event.target.value) : null })
                    }
                  >
                    <MenuItem value="">
                      <em>{t('problems.filter.all')}</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.filter.difficulty')}</InputLabel>
                  <Select
                    label={t('problems.filter.difficulty')}
                    value={filter.difficulty ?? ''}
                    onChange={(event) =>
                      onChange({ difficulty: event.target.value ? Number(event.target.value) : null })
                    }
                  >
                    <MenuItem value="">
                      <em>{t('problems.filter.all')}</em>
                    </MenuItem>
                    {difficulties.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.filter.status.label')}</InputLabel>
                  <Select
                    label={t('problems.filter.status.label')}
                    value={filter.status ?? ''}
                    onChange={(event) =>
                      onChange({ status: event.target.value ? Number(event.target.value) : null })
                    }
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.label} value={option.value ?? ''}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.filter.ordering.label')}</InputLabel>
                  <Select
                    label={t('problems.filter.ordering.label')}
                    value={filter.ordering ?? '-id'}
                    onChange={(event) => onChange({ ordering: event.target.value })}
                  >
                    {orderingOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.filter.lang')}</InputLabel>
                  <Select
                    label={t('problems.filter.lang')}
                    value={filter.lang ?? ''}
                    onChange={(event) =>
                      onChange({ lang: event.target.value ? String(event.target.value) : null })
                    }
                  >
                    <MenuItem value="">
                      <em>{t('problems.filter.all')}</em>
                    </MenuItem>
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={8}>
                <Autocomplete
                  multiple
                  options={tags}
                  value={selectedTags}
                  onChange={(_, value) => onChange({ tags: value.map((item) => item.id) })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('problems.filter.tags')}
                      placeholder={t('problems.filter.tagsPlaceholder')}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={
                          option.categoryTitle
                            ? `${option.name} · ${option.categoryTitle}`
                            : option.name
                        }
                        size="small"
                      />
                    ))
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
            </Grid>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(filter.favorites)}
                    onChange={(event) => onChange({ favorites: event.target.checked })}
                  />
                }
                label={t('problems.filter.favorites')}
              />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsFilter;
