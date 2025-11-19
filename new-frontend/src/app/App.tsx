import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import AuthProvider from 'app/providers/AuthProvider.tsx';
import { useSettingsContext } from 'app/providers/SettingsProvider.tsx';
import { REFRESH } from 'app/reducers/SettingsReducer.ts';
import SettingPanelToggler from 'shared/components/settings-panel/SettingPanelToggler.tsx';
import SettingsPanel from 'shared/components/settings-panel/SettingsPanel.tsx';
import useIcons from 'shared/hooks/useIcons.tsx';
import usePageTitle from 'shared/hooks/usePageTitle.tsx';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';

const App = () => {
  const { pathname } = useLocation();
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();
  useIcons();
  usePageTitle();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    configDispatch({ type: REFRESH });
  }, [mode]);

  return (
    <AuthProvider>
      <Outlet />
      <SettingsPanel />
      <SettingPanelToggler />
    </AuthProvider>
  );
};

export default App;
