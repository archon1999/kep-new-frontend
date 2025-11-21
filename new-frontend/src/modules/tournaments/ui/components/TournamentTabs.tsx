import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface TournamentTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const TournamentTabs = ({ value, onChange }: TournamentTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs
      value={value}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      onChange={(_, newValue) => onChange(newValue)}
    >
      <Tab
        value="info"
        label={t('tournaments.info')}
        icon={<IconifyIcon icon="mdi:information-outline" />}
        iconPosition="start"
        sx={{ fontWeight: 700, minHeight: 56 }}
      />
      <Tab
        value="duels"
        label={t('tournaments.duels')}
        icon={<IconifyIcon icon="mdi:sword-cross" />}
        iconPosition="start"
        sx={{ fontWeight: 700, minHeight: 56 }}
      />
      <Tab
        value="results"
        label={t('tournaments.results')}
        icon={<IconifyIcon icon="mdi:tournament" />}
        iconPosition="start"
        sx={{ fontWeight: 700, minHeight: 56 }}
      />
      <Tab
        value="schedule"
        label={t('tournaments.schedule')}
        icon={<IconifyIcon icon="mdi:calendar-clock" />}
        iconPosition="start"
        sx={{ fontWeight: 700, minHeight: 56 }}
      />
    </Tabs>
  );
};

export default TournamentTabs;
