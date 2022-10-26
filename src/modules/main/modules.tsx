import React, { ReactElement } from 'react';
import { PathConfigMap } from '@react-navigation/native';
import { BottomNavigationTabProps } from '@ui-kitten/components';

import { WidgetWrapper } from 'components/widgetWrapper';
import { useTranslation } from 'utils/locales';
import { loadingMainTasks } from './loadingTasks';
import { Task } from 'src/types';

import * as HomeComponents from './screens/home/home.screen';
import * as HubComponents from './screens/hub/hub.screen';
import * as AccountComponents from 'modules/account';
import * as HelpComponents from 'modules/help';
import * as PaymentsComponents from 'modules/payments';
import * as SpendingComponents from 'modules/spending';
import * as NotificationsComponents from 'modules/notifications';
import * as ProfileComponents from 'modules/profile';
import * as SettingsComponents from 'modules/settings';
import * as DocumentsComponents from 'modules/documents';
import * as StatementsComponents from 'modules/statements';
import * as ThemeComponents from 'modules/theme';
import * as CardsComponents from 'modules/cards';
import * as LoanComponents from 'modules/loan';
import * as OverdraftComponents from 'modules/overdraft';
import * as SweepsComponents from 'modules/sweeps';
import * as MultipartyComponents from 'modules/multiparty';
import * as TestComponents from 'modules/test';
// end-of-modules-import - HYGEN

const modules = Object.assign(
  {},
  HomeComponents,
  HubComponents,
  AccountComponents,
  HelpComponents,
  PaymentsComponents,
  SpendingComponents,
  NotificationsComponents,
  ProfileComponents,
  SettingsComponents,
  DocumentsComponents,
  StatementsComponents,
  ThemeComponents,
  CardsComponents,
  LoanComponents,
  OverdraftComponents,
  SweepsComponents,
  MultipartyComponents,
  TestComponents,
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
    name: 'Payments',
    iconName: 'nav-payments',
  },
  {
    name: 'Hub',
    iconName: 'nav-hub',
  },
  {
    name: 'Account',
    iconName: 'accounts',
  },
  {
    name: 'Spending',
    iconName: 'list',
  },
  {
    name: 'Cards',
    iconName: 'cards',
  },
  {
    name: 'Help',
    iconName: 'chat',
  },
  {
    name: 'Profile',
    iconName: 'person',
    group: 'Settings',
  },
  {
    name: 'Settings',
    iconName: 'cards-lock',
    group: 'Settings',
  },
  {
    name: 'Notifications',
    group: 'Settings',
    iconName: 'bell',
  },
  {
    name: 'Documents',
    iconName: 'documents',
    group: 'Settings',
  },
  {
    name: 'Statements',
    iconName: 'accounts',
    group: 'Settings',
  },
  {
    name: 'Theme',
    iconName: 'theme',
  },
  {
    name: 'Overdraft',
    iconName: 'settings',
  },
  {
    name: 'Loan',
    iconName: 'loans',
  },
  {
    name: 'Sweeps',
    iconName: 'settings',
  },
  {
    name: 'Multiparty',
    iconName: 'settings',
  },
  {
    name: 'Test',
    iconName: 'settings',
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

export const preLoadingTasks = (): Task[] => [
  ...loadingMainTasks(),
  ...tabs
    .map(({ name }) => modules[`loadingTasksFrom${name}`]?.() ?? [])
    .flat(),
];

type Callback = (
  item: { name: string; iconName: string },
  index: number,
) => ReactElement<BottomNavigationTabProps> | JSX.Element;

export const renderNavigationTab = (
  callback: Callback,
): ReactElement<BottomNavigationTabProps>[] => {
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
  const { t } = useTranslation('mainContainer');
  return (
    <>
      {groupsFrom(tabs.slice(SIZE)).map(([section, list], index) => (
        <WidgetWrapper key={`${section}-${index}`} title={t(section)}>
          {list.map(({ name, iconName }, index) => {
            const Widget = modules[`Hub${name}Widget`];
            return Widget ? (
              <Widget key={`${index}-${name}`} icon={iconName} />
            ) : null;
          })}
        </WidgetWrapper>
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
        Payments: modules.Payments,
        Spending: modules.Spending,
        Help: modules.Help,
        Account: modules.Account,
        Cards: modules.Cards,
        Loan: modules.Loan,
        Overdraft: modules.Overdraft,
        Multiparty: modules.Multiparty,
        Test: modules['Test'],
        Test: modules['Test'],
      }, // end-of-config-links - HYGEN
    },
  },
};
