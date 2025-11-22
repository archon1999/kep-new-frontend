import { Button, Stack, Typography } from '@mui/material';
import { FontFamily } from 'app/config.ts';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_FONT_FAMILY } from 'app/reducers/SettingsReducer';

const fontOptions: { label: string; value: FontFamily; description: string }[] = [
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', description: 'Clean & friendly' },
  { label: 'Inter', value: 'Inter', description: 'Modern & readable' },
  { label: 'Poppins', value: 'Poppins', description: 'Rounded & energetic' },
  { label: 'Manrope', value: 'Manrope', description: 'Elegant & balanced' },
];

const FontFamilyPanel = () => {
  const {
    config: { fontFamily },
    configDispatch,
  } = useSettingsContext();

  const handleFontSelect = (value: FontFamily) => {
    configDispatch({
      type: SET_FONT_FAMILY,
      payload: value,
    });
  };

  return (
    <Stack sx={{ gap: 1.5 }}>
      {fontOptions.map(({ label, value, description }) => {
        const active = fontFamily === value;

        return (
          <Button
            key={value}
            variant="soft"
            onClick={() => handleFontSelect(value)}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              gap: 2,
              borderRadius: 3,
              bgcolor: active ? 'primary.lighter' : 'background.elevation1',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: value,
                minWidth: 36,
                textAlign: 'center',
                color: active ? 'primary.main' : 'text.primary',
              }}
            >
              Aa
            </Typography>
            <Stack sx={{ alignItems: 'flex-start' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: active ? 'primary.main' : 'text.primary',
                }}
              >
                {label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            </Stack>
          </Button>
        );
      })}
    </Stack>
  );
};

export default FontFamilyPanel;
