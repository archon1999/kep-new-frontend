import { PropsWithChildren, useMemo } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createTheme } from 'app/theme/theme.ts';
import { useSettingsContext } from './SettingsProvider';

export type ThemeMode = 'light' | 'dark' | 'system';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const {
    config: { locale, fontFamily },
  } = useSettingsContext();

  const customTheme = useMemo(() => {
    const theme = createTheme(locale, fontFamily);

    return theme;
  }, [fontFamily, locale]);

  return (
    <MuiThemeProvider
      disableTransitionOnChange
      theme={customTheme}
      defaultMode="system"
      modeStorageKey="kep-mode"
    >
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
