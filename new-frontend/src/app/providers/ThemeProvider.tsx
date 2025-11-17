import { PropsWithChildren, useMemo } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import RTLMode from 'app/theme/RTLMode';
import { createTheme } from 'app/theme/theme.ts';
import { useSettingsContext } from './SettingsProvider';

export type ThemeMode = 'light' | 'dark' | 'system';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const {
    config: { textDirection, locale },
  } = useSettingsContext();

  const customTheme = useMemo(() => {
    const theme = createTheme(textDirection, locale);

    return theme;
  }, [textDirection, locale]);

  return (
    <MuiThemeProvider
      disableTransitionOnChange
      theme={customTheme}
      defaultMode="light"
      modeStorageKey="aurora-mode"
    >
      <CssBaseline enableColorScheme />
      <RTLMode>{children}</RTLMode>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
