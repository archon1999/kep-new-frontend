import { ChangeEvent, ComponentProps, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { initialConfig } from 'app/config.ts';
import { resources, getResourceById, getResourceByUsername } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { problemsApiClient } from 'modules/problems/data-access/api/problems.client';
import { contestsApiClient } from 'modules/contests/data-access/api/contests.client';
import { usersApiClient } from 'modules/users/data-access/api/users.client';
import { clearRecentPages, getRecentPages, RecentPage } from 'shared/lib/recent-pages';
import { getFlatSitemap } from 'shared/lib/sitemap';
import SimpleBar from 'simplebar-react';
import SearchTextField from './SearchTextField';
import type { Contest, ProblemList, UserList } from 'shared/api/orval/generated/endpoints/index.schemas';

const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 5;

const formatUserFullName = (user: UserList) =>
  [user.firstName, user.lastName].filter(Boolean).join(' ');

const SearchResult = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [recentPages, setRecentPages] = useState<RecentPage[]>(getRecentPages());
  const [users, setUsers] = useState<UserList[]>([]);
  const [problems, setProblems] = useState<ProblemList[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debouncedSearch = useDebouncedValue(searchValue.trim(), 400);
  const hasQuery = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const sitemapEntries = useMemo(() => getFlatSitemap(), []);

  useEffect(() => {
    setRecentPages(getRecentPages());
  }, []);

  useEffect(() => {
    if (!hasQuery) {
      setUsers([]);
      setProblems([]);
      setContests([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    Promise.all([
      usersApiClient.list({ search: debouncedSearch, pageSize: MAX_RESULTS }),
      problemsApiClient.list({ search: debouncedSearch, pageSize: MAX_RESULTS }),
      contestsApiClient.list({ title: debouncedSearch, pageSize: MAX_RESULTS }),
    ])
      .then(([usersResponse, problemsResponse, contestsResponse]) => {
        setUsers(usersResponse?.data ?? []);
        setProblems(problemsResponse?.data ?? []);
        setContests(contestsResponse?.data ?? []);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearch, hasQuery]);

  const resourceResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    const normalized = debouncedSearch.toLowerCase();

    return sitemapEntries
      .map((entry) => ({
        ...entry,
        translated: t(entry.key ?? entry.name),
      }))
      .filter(({ translated }) => translated.toLowerCase().includes(normalized))
      .slice(0, MAX_RESULTS);
  }, [debouncedSearch, hasQuery, sitemapEntries, t]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClearHistory = () => {
    clearRecentPages();
    setRecentPages([]);
  };

  const hasAnyResults =
    resourceResults.length > 0 || users.length > 0 || problems.length > 0 || contests.length > 0;
  const showNoResults = hasQuery && !isLoading && !hasAnyResults && !hasError;

  return (
    <>
      <SearchField value={searchValue} onChange={handleSearchChange} handleClose={handleClose} />
      <SimpleBar style={{ maxHeight: 600, minHeight: 0, width: '100%' }}>
        <Box sx={{ px: 3, py: 1.25 }}>
          {!hasQuery && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.disabled' }}>
                {t('common.globalSearch.recent')}
              </Typography>

              {recentPages.length > 0 && (
                <Link
                  component="button"
                  variant="caption"
                  underline="none"
                  sx={{ fontWeight: 'medium' }}
                  onClick={handleClearHistory}
                >
                  {t('common.globalSearch.clearHistory')}
                </Link>
              )}
            </Stack>
          )}

          {!hasQuery && recentPages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              {t('common.globalSearch.emptyRecent')}
            </Typography>
          )}

          {!hasQuery && recentPages.length > 0 && (
            <List dense sx={{ pt: 0, pb: 2 }}>
              {recentPages.map((page) => (
                <ListItemButton
                  key={page.path}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleClose}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconifyIcon
                      icon={page.icon ?? 'material-symbols:history-rounded'}
                      fontSize={20}
                      color={page.icon ? undefined : 'grey.500'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={page.label}
                    secondary={t('common.globalSearch.pathLabel', { path: page.path })}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        {!hasQuery && <Divider />}

        {!hasQuery && searchValue.length > 0 && (
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('common.globalSearch.minimumChars', { count: MIN_SEARCH_LENGTH })}
            </Typography>
          </Box>
        )}

        {hasQuery && resourceResults.length > 0 && (
          <ResultItemSection title={t('common.globalSearch.resources')}>
            <List sx={{ pt: 0, pb: 2 }}>
              {resourceResults.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path!}
                  onClick={handleClose}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconifyIcon icon={item.icon ?? 'material-symbols:menu-rounded'} fontSize={20} />
                  </ListItemIcon>
                  <ListItemText primary={item.translated} />
                </ListItemButton>
              ))}
            </List>
          </ResultItemSection>
        )}

        {hasQuery && (
          <Stack spacing={2} sx={{ px: 3 }}>
            <SearchResultSection
              title={t('common.globalSearch.users')}
              loading={isLoading}
              hasContent={users.length > 0}
              emptyLabel={t('common.globalSearch.noResults')}
              loadingLabel={t('common.globalSearch.loading')}
            >
              <List sx={{ pt: 0, pb: 0 }}>
                {users.map((user) => {
                  const fullName = formatUserFullName(user);
                  return (
                    <ListItemButton
                      key={user.username}
                      component={RouterLink}
                      to={getResourceByUsername(resources.UserProfile, user.username)}
                      onClick={handleClose}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Avatar src={user.avatar || `${initialConfig.assetsDir}/images/avatar/1.webp`} sx={{ width: 28, height: 28 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.username}
                        secondary={fullName || undefined}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </SearchResultSection>

            <SearchResultSection
              title={t('common.globalSearch.problems')}
              loading={isLoading}
              hasContent={problems.length > 0}
              emptyLabel={t('common.globalSearch.noResults')}
              loadingLabel={t('common.globalSearch.loading')}
            >
              <List sx={{ pt: 0, pb: 0 }}>
                {problems.map((problem) => (
                  <ListItemButton
                    key={problem.id}
                    component={RouterLink}
                    to={getResourceById(resources.Problem, Number(problem.id))}
                    onClick={handleClose}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <IconifyIcon icon="mdi:code-tags" fontSize={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={problem.title}
                      secondary={`#${problem.id}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </SearchResultSection>

            <SearchResultSection
              title={t('common.globalSearch.contests')}
              loading={isLoading}
              hasContent={contests.length > 0}
              emptyLabel={t('common.globalSearch.noResults')}
              loadingLabel={t('common.globalSearch.loading')}
            >
              <List sx={{ pt: 0, pb: 2 }}>
                {contests.map((contest) => (
                  <ListItemButton
                    key={contest.id}
                    component={RouterLink}
                    to={getResourceById(resources.Contest, Number(contest.id))}
                    onClick={handleClose}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <IconifyIcon icon="mdi:trophy-outline" fontSize={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={contest.title}
                      secondary={contest.type}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </SearchResultSection>
          </Stack>
        )}

        {hasError && (
          <Typography variant="body2" color="error" sx={{ px: 3, py: 2 }}>
            {t('common.globalSearch.error')}
          </Typography>
        )}

        {showNoResults && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 2 }}>
            {t('common.globalSearch.noResults')}
          </Typography>
        )}
      </SimpleBar>
    </>
  );
};

export const SearchField = ({ handleClose, ...rest }: { handleClose: () => void } & ComponentProps<typeof SearchTextField>) => {
  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    initialFocusRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <SearchTextField
      fullWidth
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
              <IconButton edge="end" size="small" onClick={handleClose}
                sx={{ color: 'grey.500' }}
              >
                <IconifyIcon icon="material-symbols:close-rounded" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...rest}
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

const SearchResultSection = ({
  title,
  children,
  loading,
  hasContent,
  emptyLabel,
  loadingLabel,
}: PropsWithChildren<{
  title: string;
  loading: boolean;
  hasContent: boolean;
  emptyLabel: string;
  loadingLabel: string;
}>) => {
  return (
    <Box>
      <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 'medium', mb: 1.5, display: 'block' }}>
        {title}
      </Typography>
      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {loadingLabel}
        </Typography>
      )}
      {hasContent ? children : !loading ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {emptyLabel}
        </Typography>
      ) : null}
    </Box>
  );
};

export default SearchResult;
