import { useEffect } from 'react';
import { useMatches } from 'react-router';
import { useTranslation } from 'react-i18next';

type TitleHandle = {
  titleKey: string;
};

const DEFAULT_TITLE = 'KEP.uz';
const TITLE_NAMESPACE = 'PageTitle';

const isTitleHandle = (handle: unknown): handle is TitleHandle =>
  typeof handle === 'object' &&
  handle !== null &&
  typeof (handle as Record<string, unknown>).titleKey === 'string';

const usePageTitle = () => {
  const matches = useMatches();
  const { t } = useTranslation();

  useEffect(() => {
    const matchWithTitle = [...matches]
      .reverse()
      .find((match) => isTitleHandle(match.handle));

    if (matchWithTitle && isTitleHandle(matchWithTitle.handle)) {
      const translatedTitle = t(`${TITLE_NAMESPACE}.${matchWithTitle.handle.titleKey}`);
      document.title = `${translatedTitle} - KEP.uz`;
      return;
    }

    document.title = DEFAULT_TITLE;
  }, [matches, t]);
};

export default usePageTitle;
