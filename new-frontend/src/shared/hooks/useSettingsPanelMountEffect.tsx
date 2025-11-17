import { useEffect } from 'react';
import { SettingsPanelConfig, useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { Config } from 'config';

const useSettingsPanelMountEffect = (effects: Partial<SettingsPanelConfig>) => {
  const { settingsPanelConfig, setSettingsPanelConfig } = useSettingsPanelContext();

  useEffect(() => {
    setSettingsPanelConfig(effects);
    const undoEffects = Object.keys(effects).reduce((acc, effect) => {
      // @ts-ignore
      acc[effect] = settingsPanelConfig[effect as keyof Config];
      return acc;
    }, {} as Partial<SettingsPanelConfig>);
    return () => {
      setSettingsPanelConfig(undoEffects);
    };
  }, []);
};

export default useSettingsPanelMountEffect;
