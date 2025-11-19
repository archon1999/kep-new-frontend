import { Chip, ChipProps, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';

const rankColorMap = {
  R4: 'neutral',
  R3: 'green',
  R2: 'cyan',
  R1: 'blue',
  CM: 'purple',
  M: 'yellow',
  IM: 'orange',
  GM: 'red',
  SGM: 'black',
} as const;

const getChipStyles = (color: string, theme: Theme) => {
  switch (color) {
    case 'green':
      return { bgcolor: theme.palette.success.lighter, color: theme.palette.success.darker };
    case 'cyan':
      return { bgcolor: theme.palette.info.lighter, color: theme.palette.info.darker };
    case 'blue':
      return { bgcolor: theme.palette.primary.lighter, color: theme.palette.primary.darker };
    case 'purple':
      return { bgcolor: theme.palette.secondary.lighter, color: theme.palette.secondary.darker };
    case 'yellow':
      return { bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText };
    case 'orange':
      return { bgcolor: theme.palette.warning.main, color: theme.palette.common.white };
    case 'red':
      return { bgcolor: theme.palette.error.light, color: theme.palette.error.darker };
    case 'black':
      return { bgcolor: theme.palette.common.black, color: theme.palette.common.white };
    case 'neutral':
    default:
      return { bgcolor: theme.palette.grey[200], color: theme.palette.text.primary };
  }
};

interface ChallengesRatingChipProps extends Omit<ChipProps, 'label'> {
  title?: string | null;
}

const ChallengesRatingChip = ({ title, size = 'small', ...chipProps }: ChallengesRatingChipProps) => {
  const theme = useTheme();

  if (!title) {
    return null;
  }

  const colorKey = rankColorMap[title as keyof typeof rankColorMap] ?? 'neutral';
  const { bgcolor, color } = getChipStyles(colorKey, theme);

  return (
    <Chip
      label={title}
      size={size}
      variant="soft"
      sx={{
        textTransform: 'uppercase',
        fontWeight: 600,
        bgcolor,
        color,
      }}
      {...chipProps}
    />
  );
};

export default ChallengesRatingChip;
