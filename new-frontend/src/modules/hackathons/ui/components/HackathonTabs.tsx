import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getResourceByParams, resources } from 'app/routes/resources';
import { Hackathon } from '../../domain/entities/hackathon.entity';

interface HackathonTabsProps {
  hackathon: Hackathon;
}

const HackathonTabs = ({ hackathon }: HackathonTabsProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = [
    { label: t('hackathons.tabs.overview'), path: getResourceByParams(resources.Hackathon, { id: hackathon.id }) },
    { label: t('hackathons.tabs.projects'), path: getResourceByParams(resources.HackathonProjects, { id: hackathon.id }) },
    { label: t('hackathons.tabs.attempts'), path: getResourceByParams(resources.HackathonAttempts, { id: hackathon.id }) },
    { label: t('hackathons.tabs.standings'), path: getResourceByParams(resources.HackathonStandings, { id: hackathon.id }) },
    { label: t('hackathons.tabs.registrants'), path: getResourceByParams(resources.HackathonRegistrants, { id: hackathon.id }) },
  ];

  const currentIndex = tabs.findIndex((tab) => location.pathname.startsWith(tab.path.replace(':symbol', '')));

  return (
    <Tabs value={currentIndex === -1 ? 0 : currentIndex} variant="scrollable" scrollButtons="auto">
      {tabs.map((tab) => (
        <Tab key={tab.path} label={tab.label} component={RouterLink} to={tab.path} />
      ))}
    </Tabs>
  );
};

export default HackathonTabs;
