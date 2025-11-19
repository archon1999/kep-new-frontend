import { PropsWithChildren, useEffect } from 'react';
import { useMatches } from 'react-router';
import { useTranslation } from 'react-i18next';

type DocumentTitleHandle = {
  titleKey?: string;
};

const APP_NAME = 'KEP.uz';

const getTitleKeyFromMatches = (matches: ReturnType<typeof useMatches>) => {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index].handle as DocumentTitleHandle | undefined;
    if (handle?.titleKey) {
      return handle.titleKey;
    }
  }

  return undefined;
};

const DocumentTitleProvider = ({ children }: PropsWithChildren) => {
  const matches = useMatches();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const titleKey = getTitleKeyFromMatches(matches);

    if (titleKey) {
      const translatedTitle = t(titleKey);
      document.title = `${translatedTitle} - ${APP_NAME}`;
    } else {
      document.title = APP_NAME;
    }
  }, [matches, t, i18n.language]);

  return <>{children}</>;
};

export default DocumentTitleProvider;
