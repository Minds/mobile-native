/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactElement } from 'react';
import { PathConfigMap } from '@react-navigation/native';
import { useTranslation } from './locales';
import { Text, View } from 'react-native';
import { loadingMainTasks } from './loadingTasks';

// import * as HomeComponents from './screens/home/home.screen';
// import * as HubComponents from './screens/hub/hub.screen';
// import * as NotificationsComponents from 'modules/notifications';
// import * as SettingsComponents from 'modules/settings';
// end-of-modules-import - HYGEN

const modules = Object.assign(
  {},
  // HomeComponents,
  // HubComponents,
  // NotificationsComponents,
  // SettingsComponents,
); // end-of-modules - HYGEN

const SIZE = 3;

type Tab = {
  name: string;
  iconName: string;
  group?: string;
};

const tabs: Tab[] = [
  {
    name: 'Home',
    iconName: 'nav-home',
  },
  {
    name: 'Notifications',
    iconName: 'bell',
  },
  {
    name: 'Hub',
    iconName: 'nav-hub',
  },
  {
    name: 'Settings',
    iconName: 'cards-lock',
  },
]; // end-of-tab-list - HYGEN

export const renderTabScreens = (Screen: React.ComponentType): JSX.Element => {
  return (
    <>
      {tabs.map(({ name }, index) => {
        const props = {
          name,
          component: ['Home', 'Hub'].includes(name)
            ? modules[`${name}Screen`]
            : modules[`${name}Navigator`],
        };
        return <Screen key={`${index}-${name}`} {...props} />;
      })}
    </>
  );
};

export const preLoadingTasks = (): any[] => [
  ...loadingMainTasks(),
  ...tabs
    .map(({ name }) => modules[`loadingTasksFrom${name}`]?.() ?? [])
    .flat(),
];

type Callback = (
  item: { name: string; iconName: string },
  index: number,
) => ReactElement<any> | JSX.Element;

export const renderNavigationTab = (
  callback: Callback,
): ReactElement<any>[] => {
  return tabs.slice(0, SIZE).map(callback);
};

function groupsFrom<T extends { name: string; group?: string }>(
  items: T[],
): [string, T[]][] {
  return Object.entries<T[]>(
    items.reduce((groups, item) => {
      const { group = item.name } = item;
      const list = groups[group] || [];
      list.push(item);
      groups[group] = list;
      return groups;
    }, Object.assign({})),
  );
}

export function renderHubWidgets(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      {groupsFrom(tabs.slice(SIZE)).map(([section, list], index) => (
        <View key={`${section}-${index}`}>
          <Text>{t(section)}</Text>
          {list.map(({ name, iconName }, idx) => {
            const Widget = modules[`Hub${name}Widget`];
            return Widget ? (
              <Widget key={`${idx}-${name}`} icon={iconName} />
            ) : null;
          })}
        </View>
      ))}
    </>
  );
}

type Config = {
  screens: PathConfigMap<Record<string, never>>;
};

export const config: Config = {
  screens: {
    Main: {
      screens: {
        // Notifications: modules.Notifications,
        // Settings: modules.Settings,
      }, // end-of-config-links - HYGEN
    },
  },
};
