import { Theme } from '@mui/material';
import { cssVarRgba } from 'shared/lib/utils';

const monacoEditor = (theme: Theme) => ({
  '& .monaco-editor': {
    '--vscode-editorGutter-background': 'inherit',
    '--vscode-editor-background': 'inherit',
    background: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.5),
    borderRadius: 7,
    border: `1px solid ${theme.vars.palette.common.white}`,
    margin: '0 0.5rem',
    ...theme.applyStyles('dark', {
      background: cssVarRgba(theme.vars.palette.common.blackChannel, 0.5),
      border: `1px solid ${theme.vars.palette.common.black}`,
    }),
    '& .current-line': {
      border: 'none !important',
    },
    '& .margin-view-overlays': {
      background: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.75),
      width: '45px !important',
      ...theme.applyStyles('dark', {
        background: cssVarRgba(theme.vars.palette.common.blackChannel, 0.8),
      }),
      '& > div': {
        width: '32px !important',
        '& .line-numbers': {
          paddingLeft: 10,
          textAlign: 'left !important',
        },
      },
    },
    '& .monaco-scrollable-element': {
      left: '50px !important',
    },
  },
});

export default monacoEditor;
