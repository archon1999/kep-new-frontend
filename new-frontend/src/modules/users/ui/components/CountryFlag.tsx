import { Box, Typography } from '@mui/material';

interface CountryFlagProps {
  code?: string;
  size?: number;
  withFallbackCode?: boolean;
}

const toFlagEmoji = (countryCode: string) =>
  countryCode
    .trim()
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
    .map((codePoint) => String.fromCodePoint(codePoint))
    .join('');

const CountryFlag = ({ code, size = 18, withFallbackCode = true }: CountryFlagProps) => {
  if (!code) return null;

  const normalized = code.trim().toUpperCase();
  const isValid = normalized.length === 2 && /^[A-Z]{2}$/.test(normalized);

  if (!isValid) {
    return withFallbackCode ? (
      <Typography variant="caption" color="text.secondary">
        {normalized}
      </Typography>
    ) : null;
  }

  return (
    <Box component="span" fontSize={size} lineHeight={1} aria-label={normalized}>
      {toFlagEmoji(normalized)}
    </Box>
  );
};

export default CountryFlag;
