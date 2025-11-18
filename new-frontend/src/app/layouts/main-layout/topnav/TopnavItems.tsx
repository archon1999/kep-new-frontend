import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button, Stack } from '@mui/material';
import sitemap, { MenuItem } from 'app/routes/sitemap';
import clsx from 'clsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import NavitemPopover from './NavItemPopover';

interface TopnavItemsProps {
  type?: 'default' | 'slim';
}

const TopnavItems = ({ type = 'default' }: TopnavItemsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<null | MenuItem>(null);
  const { pathname } = useLocation();

  const isMenuActive = useMemo(() => {
    const checkLink = (item: MenuItem): boolean => {
      if (pathname === item.path || (item.selectionPrefix && pathname!.includes(item.selectionPrefix))) {
        return true;
      }
      return item.items ? item.items.some(checkLink) : false;
    };

    return checkLink;
  }, [pathname]);

  useEffect(() => {
    setAnchorEl(null);
    setSelectedMenu(null);
  }, [pathname]);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: '2px',
      }}
      className="nav-items"
    >
      {sitemap.map((menu) => (
        <Button
          key={menu.pathName}
          component={menu.items ? undefined : NavLink}
          to={menu.items ? undefined : menu.path}
          variant="text"
          className={clsx({
            active: isMenuActive(menu),
          })}
          color={isMenuActive(menu) ? 'primary' : 'neutral'}
          size={type === 'slim' ? 'small' : 'large'}
          endIcon={menu.items ? <IconifyIcon icon="material-symbols:expand-more-rounded" /> : undefined}
          onClick={(event) => {
            if (!menu.items) return;
            setAnchorEl(event.currentTarget);
            setSelectedMenu(menu);
          }}
          sx={{ px: 2, fontSize: 14 }}
        >
          {menu.name}
        </Button>
      ))}
      {selectedMenu && (
        <NavitemPopover
          handleClose={() => {
            setAnchorEl(null);
            setSelectedMenu(null);
          }}
          anchorEl={anchorEl}
          open={!!anchorEl && !!selectedMenu}
          items={selectedMenu.items}
          level={0}
        />
      )}
    </Stack>
  );
};

export default TopnavItems;
