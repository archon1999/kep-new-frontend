import { Button, Tooltip } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface HolidayEffectsToggleProps {
  type?: 'default' | 'slim';
}

const HolidayEffectsToggle = ({ type = 'default' }: HolidayEffectsToggleProps) => {
  const {
    config: { showHolidayEffects },
    setConfig,
  } = useSettingsContext();
  const { t } = useTranslation();

  const label = showHolidayEffects
    ? t('common.disableHolidayEffects')
    : t('common.enableHolidayEffects');

  return (
    <Tooltip title={label}>
      <Button
        color={showHolidayEffects ? 'primary' : 'neutral'}
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        onClick={() => setConfig({ showHolidayEffects: !showHolidayEffects })}
        size={type === 'slim' ? 'small' : 'medium'}
        aria-label={label}
        aria-pressed={showHolidayEffects}
      >
        <IconifyIcon
          icon={
            showHolidayEffects
              ? 'material-symbols:celebration-rounded'
              : 'material-symbols:ac-unit-rounded'
          }
          sx={{ fontSize: type === 'slim' ? 18 : 22 }}
        />
      </Button>
    </Tooltip>
  );
};

export default HolidayEffectsToggle;
