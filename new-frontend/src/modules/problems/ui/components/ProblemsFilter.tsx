import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProblemsFilter } from '../../domain/entities/problems-filter.entity.ts';
import { ProblemCategory, ProblemDifficultyOption, ProblemLanguage } from '../../domain/ports/problems.repository.ts';
import KepIcon from 'shared/components/icons/KepIcon.tsx';

const orderingOptions = [
  { label: 'problems.orderNewestFirst', value: '-id' },
  { label: 'problems.orderOldestFirst', value: 'id' },
  { label: 'problems.orderEasiestFirst', value: 'difficulty,-solved' },
  { label: 'problems.orderHardestFirst', value: '-difficulty,solved' },
  { label: 'problems.orderMostSolvedFirst', value: '-solved' },
  { label: 'problems.orderLeastSolvedFirst', value: 'solved' },
];

const statusOptions = [
  { label: 'problems.statusUnknown', value: 3 },
  { label: 'problems.statusSolved', value: 1 },
  { label: 'problems.statusUnsolved', value: 2 },
];

interface ProblemsFilterProps {
  filter: ProblemsFilter;
  onChange: (next: ProblemsFilter) => void;
  categories?: ProblemCategory[];
  languages?: ProblemLanguage[];
  difficulties?: ProblemDifficultyOption[];
  total?: number;
}

const ProblemsFilter = ({ filter, onChange, categories, difficulties, languages, total }: ProblemsFilterProps) => {
  const { t } = useTranslation();

  const tags = useMemo(
    () =>
      (categories ?? []).flatMap((category) =>
        (category.tags ?? []).map((tag) => ({
          id: tag.id,
          name: tag.name,
          categoryTitle: category.title,
        })),
      ),
    [categories],
  );

  const selectedTagsNames = useMemo(
    () => tags.filter((tag) => (filter.tags ?? []).includes(tag.id)).map((tag) => tag.name),
    [filter.tags, tags],
  );

  const handleChange = (changed: Partial<ProblemsFilter>) => {
    onChange({ ...filter, ...changed });
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <KepIcon name="filter" fontSize={22} />
            <Typography variant="h6">{t('problems.filterTitle')}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              ({total ?? 0})
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={2}>
          <TextField
            fullWidth
            value={filter.search ?? ''}
            onChange={(event) => handleChange({ search: event.target.value, page: 1 })}
            placeholder={t('problems.searchPlaceholder')}
            InputProps={{ startAdornment: <KepIcon name="search" fontSize={18} /> }}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>{t('problems.orderBy')}</InputLabel>
              <Select
                label={t('problems.orderBy')}
                value={filter.ordering ?? ''}
                onChange={(event) => handleChange({ ordering: event.target.value || undefined, page: 1 })}
              >
                <MenuItem value="">
                  <em>{t('problems.orderingDefault')}</em>
                </MenuItem>
                {orderingOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('problems.language')}</InputLabel>
              <Select
                label={t('problems.language')}
                value={filter.lang ?? ''}
                onChange={(event) => handleChange({ lang: event.target.value || undefined, page: 1 })}
              >
                <MenuItem value="">
                  <em>{t('problems.languageAll')}</em>
                </MenuItem>
                {(languages ?? []).map((lang) => (
                  <MenuItem key={lang.lang} value={lang.lang}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2">{lang.lang.toUpperCase()}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lang.langFull}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('problems.topics')}</InputLabel>
              <Select
                label={t('problems.topics')}
                value={filter.category ?? ''}
                onChange={(event) => handleChange({ category: event.target.value ? Number(event.target.value) : null, page: 1 })}
              >
                <MenuItem value="">
                  <em>{t('problems.topicsAll')}</em>
                </MenuItem>
                {(categories ?? []).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {category.icon ? <KepIcon name={category.icon} fontSize={18} color="primary" /> : null}
                      <Typography variant="body2" flexGrow={1}>
                        {category.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.problemsCount ?? 0}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Autocomplete
              multiple
              fullWidth
              disableCloseOnSelect
              options={tags}
              value={tags.filter((tag) => (filter.tags ?? []).includes(tag.id))}
              onChange={(_, value) => handleChange({ tags: value.map((tag) => tag.id), page: 1 })}
              getOptionLabel={(option) => option.name}
              groupBy={(option) => option.categoryTitle}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('problems.tags')}
                  placeholder={
                    selectedTagsNames.length ? selectedTagsNames.join(', ') : t('problems.tagsPlaceholder')
                  }
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>{t('problems.difficulty')}</InputLabel>
              <Select
                label={t('problems.difficulty')}
                value={filter.difficulty ?? ''}
                onChange={(event) =>
                  handleChange({ difficulty: event.target.value ? Number(event.target.value) : null, page: 1 })
                }
              >
                <MenuItem value="">
                  <em>{t('problems.difficultyAll')}</em>
                </MenuItem>
                {(difficulties ?? []).map((difficulty) => (
                  <MenuItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('problems.status')}</InputLabel>
              <Select
                label={t('problems.status')}
                value={filter.status ?? ''}
                onChange={(event) =>
                  handleChange({ status: event.target.value ? Number(event.target.value) : null, page: 1 })
                }
              >
                <MenuItem value="">
                  <em>{t('problems.statusAll')}</em>
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {t(status.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider />

          <Box display="flex" justifyContent="flex-end">
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(filter.favorites)}
                  onChange={(event) => handleChange({ favorites: event.target.checked, page: 1 })}
                />
              }
              label={t('problems.favoritesOnly')}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsFilter;
