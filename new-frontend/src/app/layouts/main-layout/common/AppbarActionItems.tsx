import { ReactElement } from 'react';
import { Stack, SxProps } from '@mui/material';
import LanguageMenu from './LanguageMenu';
import ProfileMenu from './ProfileMenu';
import ThemeToggler from './ThemeToggler';
import NavbarNotifications from './notifications/NavbarNotifications';

interface AppbarActionItemsProps {
  type?: 'default' | 'slim';
  sx?: SxProps;
  searchComponent?: ReactElement;
}

const AppbarActionItems = ({ type = 'default', sx, searchComponent }: AppbarActionItemsProps) => {
  return (
    <Stack
      className="action-items"
      spacing={1}
      sx={{
        alignItems: 'center',
        ml: 'auto',
        ...sx,
      }}
    >
      {searchComponent}
      <LanguageMenu type={type} />
      <ThemeToggler type={type} />
      <NavbarNotifications type={type} />
      <ProfileMenu type={type} />
    </Stack>
  );
};

export default AppbarActionItems;
