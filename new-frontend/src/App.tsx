import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import AuthProvider from 'app/providers/AuthProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { REFRESH } from 'app/reducers/SettingsReducer';
import SettingPanelToggler from 'shared/components/settings-panel/SettingPanelToggler';
import SettingsPanel from 'shared/components/settings-panel/SettingsPanel';
import useIcons from 'shared/hooks/useIcons';
import { useThemeMode } from 'shared/hooks/useThemeMode';

const App = () => {
  const { pathname } = useLocation();
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();
  useIcons();

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
