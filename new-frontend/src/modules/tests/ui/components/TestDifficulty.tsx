import { Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import { useTranslation } from 'react-i18next';

interface Props {
  value: number;
}

export const DifficultyStars = ({ value }: Props) => {
  const { t } = useTranslation();
  const stars = [1, 2, 3];

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {stars.map((star) =>
        star <= value ? (
          <StarRoundedIcon key={star} color="warning" fontSize="small" />
        ) : (
          <StarOutlineRoundedIcon key={star} color="disabled" fontSize="small" />
        ),
      )}
      <Typography variant="caption" color="text.secondary" ml={0.5}>
        {t('testsPage.difficulty')}
      </Typography>
    </Stack>
  );
};
