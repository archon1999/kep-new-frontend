import { SyntheticEvent } from 'react';
import { TabList } from '@mui/lab';
import { InputAdornment, Stack, Tab, Typography, alpha, styled, tabsClasses, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { AccountSettingsTab } from './accountSettingsTabs';

interface SideTabListProps {
  tabs: AccountSettingsTab[];
  onChange: (event: SyntheticEvent, newValue: string) => void;
  onTabClick?: () => void;
}

const AccountTab = styled(Tab)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  minHeight: 56,
  maxWidth: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
}));

const SideTabList = ({ tabs, onChange, onTabClick }: SideTabListProps) => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack direction="column" spacing={3} sx={{ p: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: 'h5.fontSize', md: 'h6.fontSize', lg: 'h4.fontSize' },
        }}
      >
        <IconifyIcon icon="material-symbols:settings-outline" sx={{ fontSize: { xs: 22, lg: 26 } }} />
        Account Settings
      </Typography>

      <StyledTextField
        id="settings-search-box"
        type="search"
        placeholder="Find a setting"
        fullWidth
        size="large"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="material-symbols:search-rounded" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TabList
        orientation="vertical"
        variant="scrollable"
        scrollButtons={false}
        onChange={onChange}
        sx={{
          [`& .${tabsClasses.indicator}`]: { display: 'none' },
          [`& .${tabsClasses.list}`]: {
            gap: 10,
            display: downMd ? 'grid' : 'flex',
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        }}
      >
        {tabs.map((tab) => (
          <AccountTab
            key={tab.id}
            value={tab.value}
            icon={<IconifyIcon icon={tab.icon} sx={{ fontSize: 22, mr: 1 }} />}
            iconPosition="start"
            label={
              <Typography noWrap fontWeight={700} sx={{ textAlign: 'left' }}>
                {tab.label}
              </Typography>
            }
            onClick={() => {
              if (downMd) {
                onTabClick?.();
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ))}
      </TabList>
    </Stack>
  );
};

export default SideTabList;
