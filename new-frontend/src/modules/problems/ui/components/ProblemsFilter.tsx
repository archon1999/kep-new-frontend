import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { useTranslation } from 'react-i18next';

export interface ProblemsFilterProps {
  value: {
    search?: string;
    difficulty?: number;
    status?: number;
    hasSolution?: boolean;
    hasChecker?: boolean;
    favorites?: boolean;
  };
  availableTags?: { id: number; name: string }[];
  selectedTags?: number[];
  onChange: (filters: ProblemsFilterProps['value'] & { tags?: number[] }) => void;
  onReset: () => void;
}

const ProblemsFilter = ({ value, onChange, onReset, availableTags = [], selectedTags = [] }: ProblemsFilterProps) => {
  const { t } = useTranslation();

  const difficultyOptions = useMemo(
    () => [
      { label: t('common.allLevels'), value: 0 },
      { label: t('problems.difficulty.beginner'), value: 1 },
      { label: t('problems.difficulty.basic'), value: 2 },
      { label: t('problems.difficulty.normal'), value: 3 },
      { label: t('problems.difficulty.medium'), value: 4 },
      { label: t('problems.difficulty.advanced'), value: 5 },
      { label: t('problems.difficulty.hard'), value: 6 },
      { label: t('problems.difficulty.extremal'), value: 7 },
    ],
    [t],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('problems.filterTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.filterSubtitle')}
            </Typography>
          </Stack>

          <TextField
            fullWidth
            label={t('problems.searchLabel')}
            value={value.search ?? ''}
            onChange={(event) => onChange({ ...value, search: event.target.value })}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>{t('problems.difficultyLabel')}</InputLabel>
              <Select
                label={t('problems.difficultyLabel')}
                value={value.difficulty ?? 0}
                onChange={(event) => onChange({ ...value, difficulty: Number(event.target.value) })}
              >
                {difficultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('problems.statusLabel')}</InputLabel>
              <Select
                label={t('problems.statusLabel')}
                value={value.status ?? 0}
                onChange={(event) => onChange({ ...value, status: Number(event.target.value) })}
              >
                {[0, 1, 2, 3, 4].map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`problems.status.${status}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('problems.tagsLabel')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <Chip
                    key={tag.id}
                    color={isSelected ? 'secondary' : 'default'}
                    label={tag.name}
                    onClick={() => {
                      const updated = isSelected
                        ? selectedTags.filter((tagId) => tagId !== tag.id)
                        : [...selectedTags, tag.id];
                      onChange({ ...value, tags: updated });
                    }}
                  />
                );
              })}
              {!availableTags.length && (
                <Typography variant="body2" color="text.secondary">
                  {t('problems.tagsPlaceholder')}
                </Typography>
              )}
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(value.hasSolution)}
                  onChange={(_, checked) => onChange({ ...value, hasSolution: checked })}
                />
              }
              label={t('problems.withSolution')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(value.hasChecker)}
                  onChange={(_, checked) => onChange({ ...value, hasChecker: checked })}
                />
              }
              label={t('problems.withChecker')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(value.favorites)}
                  onChange={(_, checked) => onChange({ ...value, favorites: checked })}
                />
              }
              label={t('problems.favoritesOnly')}
            />
          </Stack>

          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={onReset}>
              {t('common.reset')}
            </Button>
            <Button variant="contained" onClick={() => onChange({ ...value })}>
              {t('common.apply')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsFilter;
