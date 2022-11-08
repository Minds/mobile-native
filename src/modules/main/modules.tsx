/**
 * Helper file for aggregating all modules screens, navigators and widgets
 * later to be used by the main navigator, tab navigator, and deep links
 */
import { PathConfigMap } from '@react-navigation/native';
// import * as SettingsComponents from 'modules/settings';
// end-of-modules-import - HYGEN

export const modules = Object.assign(
  {},
  // SettingsComponents,
); // end-of-modules - HYGEN

type Tab = {
  name: string;
  iconName: string;
  group?: string;
};

export const tabs: Tab[] = [
  // {
  //   name: 'Settings',
  //   iconName: 'cards-lock',
  // },
]; // end-of-tab-list - HYGEN

type Config = {
  screens: PathConfigMap<Record<string, never>>;
};

export const config: Config = {
  screens: {
    Main: {
      screens: {
        // Settings: modules.Settings,
      }, // end-of-config-links - HYGEN
    },
  },
};
