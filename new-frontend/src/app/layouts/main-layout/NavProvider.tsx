import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Breakpoint, ToolbarOwnProps, useTheme } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { COLLAPSE_NAVBAR, EXPAND_NAVBAR } from 'app/reducers/SettingsReducer';
import sitemap, { MenuItem } from 'app/routes/sitemap';
import { mainDrawerWidth } from 'shared/lib/constants';
import { addRecentPage } from 'shared/lib/recent-pages';
import { findMenuItemByPath } from 'shared/lib/sitemap';

interface NavContextInterface {
  openItems: string[];
  setOpenItems: Dispatch<SetStateAction<string[]>>;
  isNestedItemOpen: (items?: MenuItem[]) => boolean;
  sidenavAppbarVariant: ToolbarOwnProps['variant'];
  topbarHeight: Partial<Record<Breakpoint, number>>;
  sidenavCollapsed: boolean;
}

const NavContext = createContext({} as NavContextInterface);

const NavProvider = ({ children }: PropsWithChildren) => {
  const [openItems, setOpenItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [responsievSidenavCollapsed, setResponsiveSidenavCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const { currentBreakpoint, down } = useBreakpoints();

  const theme = useTheme();
  const downMd = down('md');

  const {
    config: { sidenavCollapsed, navigationMenuType, topnavType, sidenavType },
    setConfig,
    configDispatch,
  } = useSettingsContext();

  const isNestedItemOpen = (items: MenuItem[] = []) => {
    const checkLink = (children: MenuItem) => {
      if (
        `${children.path}` === pathname ||
        (children.selectionPrefix && pathname!.includes(children.selectionPrefix))
      ) {
        return true;
      }
      return children.items && children.items.some(checkLink);
    };
    return items.some(checkLink);
  };

  const sidenavAppbarVariant: ToolbarOwnProps['variant'] = useMemo(() => {
    if (navigationMenuType === 'sidenav') {
      return 'appbar';
    }

    switch (topnavType) {
      case 'default': {
        return 'appbar';
      }
      case 'slim': {
        return 'appbarSlim';
      }
      case 'stacked': {
        return downMd ? 'appbar' : 'appbarStacked';
      }
    }
  }, [navigationMenuType, topnavType, downMd]);

  const topbarHeight = useMemo(() => {
    if (navigationMenuType === 'sidenav') {
      return theme.mixins.topbar.default;
    } else {
      return theme.mixins.topbar[topnavType];
    }
  }, [navigationMenuType, topnavType]);

  useEffect(() => {
    const matchedItem = findMenuItemByPath(pathname, sitemap);
    const label = matchedItem ? t(matchedItem.key ?? matchedItem.name) : pathname;

    addRecentPage({
      path: pathname,
      label,
      icon: matchedItem?.icon,
    });
  }, [pathname, t]);

  useEffect(() => {
    if (navigationMenuType === 'sidenav') {
      if (sidenavType !== 'slim') {
        if (sidenavCollapsed) {
          configDispatch({
            type: COLLAPSE_NAVBAR,
          });
        }
        if (currentBreakpoint === 'md') {
          configDispatch({
            type: COLLAPSE_NAVBAR,
          });
          setResponsiveSidenavCollapsed(true);
        }
        if (downMd) {
          configDispatch({
            type: EXPAND_NAVBAR,
          });
        }
      } else {
        setConfig({
          drawerWidth: mainDrawerWidth.slim,
        });
      }
      if (currentBreakpoint === 'md') {
        setConfig({
          openNavbarDrawer: false,
        });
      }
    }
    if (!loaded) {
      setLoaded(true);
    }
  }, [currentBreakpoint, navigationMenuType, downMd]);

  useEffect(() => {
    if (currentBreakpoint !== 'md' && responsievSidenavCollapsed) {
      setResponsiveSidenavCollapsed(false);
      configDispatch({
        type: EXPAND_NAVBAR,
      });
    }
  }, [currentBreakpoint]);

  return (
    <NavContext
      value={{
        openItems,
        setOpenItems,
        isNestedItemOpen,
        sidenavAppbarVariant,
        topbarHeight,
        sidenavCollapsed,
      }}
    >
      {loaded && children}
    </NavContext>
  );
};

export const useNavContext = () => use(NavContext);

export default NavProvider;
