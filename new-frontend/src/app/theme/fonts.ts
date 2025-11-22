import { FontFamilyOption } from 'app/config';

const fontFallbacks = ['sans-serif', 'Spline Sans Mono', 'monospace'];

export const fontFamilyOptions: Record<FontFamilyOption, { labelKey: string; fontStack: string }> = {
  plusJakartaSans: {
    labelKey: 'customizePanel.fontOptions.plusJakartaSans',
    fontStack: ['Plus Jakarta Sans', ...fontFallbacks].join(','),
  },
  inter: {
    labelKey: 'customizePanel.fontOptions.inter',
    fontStack: ['Inter', ...fontFallbacks].join(','),
  },
  manrope: {
    labelKey: 'customizePanel.fontOptions.manrope',
    fontStack: ['Manrope', ...fontFallbacks].join(','),
  },
  spaceGrotesk: {
    labelKey: 'customizePanel.fontOptions.spaceGrotesk',
    fontStack: ['Space Grotesk', ...fontFallbacks].join(','),
  },
};

export const getFontFamilyStack = (fontFamily: FontFamilyOption) => fontFamilyOptions[fontFamily].fontStack;
