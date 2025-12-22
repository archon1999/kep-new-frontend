import { Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import KepIcon from 'shared/components/base/KepIcon';

interface FestiveEffectsToggleProps {
  type?: 'default' | 'slim';
}

const FestiveEffectsToggle = ({ type = 'default' }: FestiveEffectsToggleProps) => {
  const { t } = useTranslation();
  const {
    config: { festiveEffectsEnabled },
    setConfig,
  } = useSettingsContext();

  const label = festiveEffectsEnabled
    ? t('common.festiveEffects.disable')
    : t('common.festiveEffects.enable');

  const handleToggle = () => {
    setConfig({ festiveEffectsEnabled: !festiveEffectsEnabled });
  };

  return (
    <Tooltip title={label} arrow>
      <Button
        color={festiveEffectsEnabled ? 'success' : 'neutral'}
        variant={type === 'slim' ? 'text' : 'soft'}
        shape="circle"
        onClick={handleToggle}
        aria-pressed={festiveEffectsEnabled}
        aria-label={label}
        size={type === 'slim' ? 'small' : 'medium'}
      >
        <KepIcon
          name={festiveEffectsEnabled ? 'sparkle' : 'holiday'}
          fontSize={type === 'slim' ? 18 : 22}
        />
      </Button>
    </Tooltip>
  );
};

export default FestiveEffectsToggle;
