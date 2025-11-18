import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import sitemap, { SubMenuItem } from 'app/routes/sitemap';
import clsx from 'clsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useNavContext } from '../NavProvider';
import NavitemPopover from './NavItemPopover';

interface TopnavItemsProps {
  type?: 'default' | 'slim';
}

const TopnavItems = ({ type = 'default' }: TopnavItemsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<null | SubMenuItem>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isNestedItemOpen } = useNavContext();

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
          key={menu.id || menu.pathName}
          variant="text"
          className={clsx({
            active: isNestedItemOpen([menu]),
          })}
          color={isNestedItemOpen([menu]) ? 'primary' : 'neutral'}
          size={type === 'slim' ? 'small' : 'large'}
          endIcon={
            menu.items?.length ? <IconifyIcon icon="material-symbols:expand-more-rounded" /> : undefined
          }
          onClick={(event) => {
            if (menu.items?.length) {
              setAnchorEl(event.currentTarget);
              setSelectedMenu(menu);
              return;
            }
            if (menu.path) {
              navigate(menu.path);
            }
          }}
          sx={{ px: 2, fontSize: 14 }}
        >
          {menu.name}
        </Button>
      ))}
      {selectedMenu?.items?.length ? (
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
      ) : null}
    </Stack>
  );
};

export default TopnavItems;
