import arena from './arena.json';
import calendar from './calendar.json';
import challenges from './challenges.json';
import common from './common.json';
import hackathons from './hackathons.json';
import homePage from './home-page.json';
import kepcoinPage from './kepcoin-page.json';
import auth from './auth.json';
import menu from './menu.json';
import pageTitles from './page-titles.json';
import projects from './projects.json';
import settings from './settings.json';
import shop from './shop.json';
import tournaments from './tournaments.json';
import tests from './tests.json';
import users from './users.json';

export const enTranslation = {
  ...common,
  ...menu,
  ...pageTitles,
  ...settings,
  ...arena,
  ...homePage,
  ...shop,
  ...auth,
  ...calendar,
  ...hackathons,
  ...projects,
  ...tests,
  ...users,
  ...kepcoinPage,
  ...challenges,
  ...tournaments,
};

export default enTranslation;
