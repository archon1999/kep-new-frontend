import { ChangeEvent, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { getRecentPages, RecentPage, searchableMenuItems } from 'app/routes/recent-pages.ts';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { HttpContestsRepository } from 'modules/contests/data-access/repository/http.contests.repository';
import { HttpProblemsRepository } from 'modules/problems/data-access/repository/http.problems.repository';
import { HttpUsersRepository } from 'modules/users/data-access/repository/http.users.repository';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'simplebar-react';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import SearchTextField from './SearchTextField';

const usersRepository = new HttpUsersRepository();
const problemsRepository = new HttpProblemsRepository();
const contestsRepository = new HttpContestsRepository();

const MIN_QUERY_LENGTH = 2;

const getMenuItemLabel = (item: (typeof searchableMenuItems)[number], translate: (key: string) => string) => {
  const translated = item.key ? translate(item.key) : '';
  if (translated && translated !== item.key) {
    return translated;
  }
  return item.name;
};

const getRecentPageLabel = (page: RecentPage, translate: (key: string) => string) => {
  const translated = page.labelKey ? translate(page.labelKey) : '';
  if (translated && translated !== page.labelKey) {
    return translated;
  }
  return page.fallbackLabel ?? page.path;
};

const SearchResult = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 250);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);

  const shouldSearch = debouncedSearch.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    const updateRecentPages = () => setRecentPages(getRecentPages());
    updateRecentPages();
    window.addEventListener('storage', updateRecentPages);
    return () => window.removeEventListener('storage', updateRecentPages);
  }, []);

  const resourceResults = useMemo(() => {
    if (!shouldSearch) return [] as { key?: string; label: string; path: string; icon?: string }[];
    const normalized = debouncedSearch.toLowerCase();

    return searchableMenuItems
      .map((item) => ({
        item,
        label: getMenuItemLabel(item, t),
      }))
      .filter(({ item, label }) => {
        const labelMatch = label.toLowerCase().includes(normalized);
        const nameMatch = item.name.toLowerCase().includes(normalized);
        const pathMatch = item.path?.toLowerCase().includes(normalized);
        return labelMatch || nameMatch || pathMatch;
      })
      .slice(0, 5)
      .map(({ item, label }) => ({
        key: item.key,
        label,
        path: item.path!,
        icon: item.icon,
      }));
  }, [debouncedSearch, shouldSearch, t]);

  const { data: usersResult, isLoading: usersLoading } = useSWR(
    shouldSearch ? ['global-search-users', debouncedSearch] : null,
    () => usersRepository.getUsers({ search: debouncedSearch, page: 1, pageSize: 5 }),
  );

  const { data: problemsResult, isLoading: problemsLoading } = useSWR(
    shouldSearch ? ['global-search-problems', debouncedSearch] : null,
    () => problemsRepository.list({ search: debouncedSearch, page: 1, pageSize: 5 }),
  );

  const { data: contestsResult, isLoading: contestsLoading } = useSWR(
    shouldSearch ? ['global-search-contests', debouncedSearch] : null,
    () => contestsRepository.list({ title: debouncedSearch, page: 1, pageSize: 5 }),
  );

  const users = usersResult?.data ?? [];
  const problems = problemsResult?.data ?? [];
  const contests = contestsResult?.data ?? [];

  return (
    <>
      <SearchField
        value={searchValue}
        onChange={setSearchValue}
        handleClose={handleClose}
      />
      <SimpleBar style={{ maxHeight: 600, minHeight: 0, width: '100%' }}>
        {!shouldSearch && (
          <ResultItemSection title={t('search.recent')} bottomDivider={false}>
            {recentPages.length ? (
              <List disablePadding>
                {recentPages.map((page) => (
                  <ListItem disablePadding key={page.path}>
                    <ListItemButton component={RouterLink} to={page.path} onClick={handleClose}>
                      <ListItemIcon>
                        <IconifyIcon icon="solar:clock-circle-line-duotone" />
                      </ListItemIcon>
                      <ListItemText
                        primary={getRecentPageLabel(page, t)}
                        secondary={page.path}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography px={3} pb={2} color="text.secondary">
                {t('search.noRecent')}
              </Typography>
            )}
          </ResultItemSection>
        )}

        {shouldSearch && (
          <>
            <ResultItemSection title={t('search.resources')}>
              <List disablePadding>
                {resourceResults.length ? (
                  resourceResults.map((resource) => (
                    <ListItem disablePadding key={resource.path}>
                      <ListItemButton component={RouterLink} to={resource.path} onClick={handleClose}>
                        <ListItemIcon>
                          <IconifyIcon icon={resource.icon ?? 'material-symbols:search-rounded'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={resource.label}
                          secondary={resource.path}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <SectionEmptyState label={t('search.noResults')} />
                )}
              </List>
            </ResultItemSection>

            <ResultItemSection title={t('search.users')}>
              <List disablePadding>
                {usersLoading && <SectionLoader />}
                {!usersLoading && users.length === 0 && <SectionEmptyState label={t('search.noResults')} />}
                {users.map((user) => (
                  <ListItem disablePadding key={user.username}>
                    <ListItemButton
                      component={RouterLink}
                      to={getResourceByUsername(resources.UserProfile, user.username)}
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <Avatar src={user.avatar} alt={user.username} />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.username}
                        secondary={[user.firstName, user.lastName].filter(Boolean).join(' ')}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ResultItemSection>

            <ResultItemSection title={t('search.problems')}>
              <List disablePadding>
                {problemsLoading && <SectionLoader />}
                {!problemsLoading && problems.length === 0 && <SectionEmptyState label={t('search.noResults')} />}
                {problems.map((problem) => (
                  <ListItem disablePadding key={problem.id}>
                    <ListItemButton
                      component={RouterLink}
                      to={getResourceById(resources.Problem, problem.id)}
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <IconifyIcon icon="mdi:code-tags" />
                      </ListItemIcon>
                      <ListItemText
                        primary={problem.title}
                        secondary={t('search.problemId', { id: problem.id })}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ResultItemSection>

            <ResultItemSection title={t('search.contests')} bottomDivider={false}>
              <List disablePadding>
                {contestsLoading && <SectionLoader />}
                {!contestsLoading && contests.length === 0 && <SectionEmptyState label={t('search.noResults')} />}
                {contests.map((contest) => (
                  <ListItem disablePadding key={contest.id}>
                    <ListItemButton
                      component={RouterLink}
                      to={getResourceById(resources.Contest, contest.id)}
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <IconifyIcon icon="mdi:trophy-outline" />
                      </ListItemIcon>
                      <ListItemText
                        primary={contest.title}
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {t('search.contestType', {
                                type: t(`contests.contests.typeLabels.${contest.type}`, { defaultValue: contest.type }),
                              })}
                            </Typography>
                            <Chip size="small" variant="soft" color="primary" label={contest.categoryTitle} />
                          </Stack>
                        }
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ResultItemSection>
          </>
        )}
      </SimpleBar>
    </>
  );
};

export const SearchField = ({
  handleClose,
  value,
  onChange,
}: {
  handleClose: () => void;
  value: string;
  onChange: (value: string) => void;
}) => {
  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    initialFocusRef.current?.focus({ preventScroll: true });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <SearchTextField
      fullWidth
      value={value}
      onChange={handleChange}
      sx={{
        [`& .${inputBaseClasses.root}`]: {
          borderRadius: '4px 4px 0 0',
          border: 1,
          borderColor: 'transparent',
          [`&.${inputBaseClasses.focused}`]: {
            outline: 'none',
            border: 1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderColor: 'primary.main',
            boxShadow: 'none',
          },
        },
      }}
      slotProps={{
        input: {
          inputProps: {
            ref: initialFocusRef,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" edge="end" onClick={handleClose}>
                <IconifyIcon icon="material-symbols:close-rounded" color="grey.500" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

const ResultItemSection = ({
  title,
  children,
  bottomDivider = true,
}: PropsWithChildren<{ title: string; bottomDivider?: boolean }>) => {
  return (
    <Box>
      <Box sx={{ my: 2, px: 3 }}>
        <Typography
          variant="caption"
          component="h6"
          sx={{
            fontWeight: 'medium',
            color: 'text.disabled',
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
      {bottomDivider && <Divider />}
    </Box>
  );
};

const SectionLoader = () => (
  <Stack direction="row" alignItems="center" gap={1} px={3} pb={2}>
    <CircularProgress size={16} />
    <Typography variant="body2" color="text.secondary">
      Loading...
    </Typography>
  </Stack>
);

const SectionEmptyState = ({ label }: { label: string }) => (
  <Typography px={3} pb={2} color="text.secondary">
    {label}
  </Typography>
);

export default SearchResult;
