import { ChangeEvent } from 'react';
import { FormControlLabel, Radio, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FontFamilyOption } from 'app/config';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_FONT_FAMILY } from 'app/reducers/SettingsReducer';
import { fontFamilyOptions } from 'app/theme/fonts';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';

const FontFamilyPanel = () => {
  const {
    config: { fontFamily },
    configDispatch,
  } = useSettingsContext();
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as FontFamilyOption;

    configDispatch({
      type: SET_FONT_FAMILY,
      payload: value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="font-family" value={fontFamily} onChange={handleChange}>
      {(Object.entries(fontFamilyOptions) as [FontFamilyOption, (typeof fontFamilyOptions)[FontFamilyOption]][]).map(
        ([value, option]) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={
              <FontPreview
                label={t(option.labelKey)}
                fontStack={option.fontStack}
                active={fontFamily === value}
              />
            }
          />
        ),
      )}
    </SettingsPanelRadioGroup>
  );
};

export default FontFamilyPanel;

const FontPreview = ({
  label,
  fontStack,
  active,
}: {
  label: string;
  fontStack: string;
  active: boolean;
}) => (
  <Stack
    sx={{
      p: 2,
      gap: 1,
      border: 1,
      borderRadius: 2,
      borderColor: active ? 'primary.main' : 'divider',
      bgcolor: active ? 'action.hover' : 'background.paper',
      transition: (theme) => theme.transitions.create('border-color', { duration: theme.transitions.duration.short }),
    }}
  >
    <Typography variant="h5" sx={{ fontFamily: fontStack, lineHeight: 1 }}>
      Ag
    </Typography>
    <Typography variant="body2" sx={{ fontFamily: fontStack }} color="text.secondary">
      {label}
    </Typography>
  </Stack>
);
