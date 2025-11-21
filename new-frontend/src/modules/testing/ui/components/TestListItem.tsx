import { useMemo } from 'react';
import { NavLink } from 'react-router';
import { Chip, ListItemButton, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { Test } from '../../domain/entities/testing.entity';

type TestListItemProps = {
  test: Test;
};

const TestListItem = ({ test }: TestListItemProps) => {
  const { t } = useTranslation();

  const bestResultColor = useMemo(() => {
    if (test.userBestResult === undefined) return 'text.secondary';
    if (test.userBestResult === test.questionsCount) return 'success.main';
    return 'warning.main';
  }, [test.questionsCount, test.userBestResult]);

  return (
    <ListItemButton
      component={NavLink}
      to={getResourceById(resources.Test, test.id)}
      sx={{
        borderRadius: 2,
        py: 1.5,
        px: 2,
        '&:not(:last-of-type)': { mb: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} width={1} justifyContent="space-between">
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <IconifyIcon icon="mdi:clipboard-text-outline" fontSize={22} />
            <Typography variant="subtitle1" noWrap>{test.title}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
            <Chip
              size="small"
              variant="soft"
              color="neutral"
              label={t('tests.questionsCount', { count: test.questionsCount })}
            />
            <Typography variant="caption" color="text.secondary">
              {t('tests.duration', { duration: test.duration })}
            </Typography>
          </Stack>
        </Stack>

        {test.userBestResult !== undefined && (
          <Tooltip title={t('tests.bestResultTooltip')}>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography variant="subtitle1" sx={{ color: bestResultColor }}>
                {test.userBestResult}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                /
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {test.questionsCount}
              </Typography>
            </Stack>
          </Tooltip>
        )}
      </Stack>
    </ListItemButton>
  );
};

export default TestListItem;
