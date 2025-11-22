import { Chip, ChipProps } from '@mui/material';

type ChallengeChipTone = 'win' | 'draw' | 'loss';

interface ChallengeChipProps extends Omit<ChipProps, 'color'> {
  tone: ChallengeChipTone;
}

const toneStyles: Record<
  ChallengeChipTone,
  { label: string; color: string; background: string; borderColor?: string }
> = {
  win: { label: 'W', color: 'white', background: 'success.main' },
  draw: { label: 'D', color: 'text.secondary', background: 'background.main', borderColor: 'divider' },
  loss: { label: 'L', color: 'white', background: 'error.main' },
};

const ChallengeChip = ({ tone, label, sx, ...chipProps }: ChallengeChipProps) => {
  const style = toneStyles[tone];

  return (
    <Chip
      size="small"
      variant="soft"
      label={label ?? style.label}
      sx={{
        fontWeight: 800,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: style.color,
        bgcolor: style.background,
        borderColor: style.borderColor,
        borderWidth: style.borderColor ? 1 : undefined,
        borderStyle: style.borderColor ? 'solid' : undefined,
        ...sx,
      }}
      {...chipProps}
    />
  );
};

export type { ChallengeChipTone };
export default ChallengeChip;
