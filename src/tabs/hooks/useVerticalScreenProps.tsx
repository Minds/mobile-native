import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { invert } from 'lodash';
import openUrlService from '~/common/services/open-url.service';
import sessionService from '~/common/services/session.service';
import { IS_TENANT } from '~/config/Config';
import { NavigationItemTypeEnum } from '~/graphql/api';
import { CustomNavigationItems } from '~/modules/navigation/service/custom-navigation.service';
import DiscoveryStack from '~/navigation/DiscoveryStack';

import MoreStack from '~/navigation/MoreStack';
import NewsfeedStack from '~/navigation/NewsfeedStack';
import NotificationsStack from '~/navigation/NotificationsStack';

export type GroupStackParamList = {
  Groups: {};
  GroupView: {};
};
const GroupStackNav = createNativeStackNavigator<GroupStackParamList>();
const GroupStack = () => (
  <GroupStackNav.Navigator screenOptions={{ headerShown: false }}>
    <GroupStackNav.Screen
      name="Groups"
      getComponent={() => require('~/groups/GroupsListScreen').default}
    />
    <GroupStackNav.Screen
      name="GroupView"
      getComponent={() =>
        require('~/modules/groups/screens/GroupScreen').GroupScreen
      }
    />
  </GroupStackNav.Navigator>
);

const NullCmp = () => null;

export function useVerticalScreenProps(
  customNavigation: CustomNavigationItems,
) {
  const screensProps = {
    Newsfeed: {
      component: NewsfeedStack,
      options: { lazy: false },
    },
    Explore: {
      component: DiscoveryStack,
      options: { lazy: false },
    },
    ChatListStack: {
      getComponent: () => require('~/modules/chat').ChatsListStack,
      options: { lazy: true, title: 'Chat' },
    },
    Notifications: {
      component: NotificationsStack,
    },
    Profile: {
      getComponent: () => require('~/channel/v2/ChannelScreen').default,
      initialParams: { entity: sessionService.getUser() },
    },
    Boosts: {
      getComponent: () => require('modules/boost').BoostConsoleScreen,
    },
    MindsPlus: {
      getComponent: () => require('~/discovery/v2/PlusDiscoveryScreen').default,
    },
    Supermind: {
      getComponent: () => require('~/supermind/SupermindConsoleScreen').default,
    },
    Wallet: {
      getComponent: () => require('~/wallet/v3/WalletScreen').default,
    },
    AffiliateProgram: {
      getComponent: () =>
        require('modules/affiliate/screens/AffiliateProgramScreen').default,
      options: {
        drawerLabel: 'Affiliate Program',
      },
    },
    Groups: {
      component: GroupStack,
    },
    Settings: {
      component: MoreStack,
    },
  };

  if (!IS_TENANT) {
    return screensProps;
  }

  if (!customNavigation) {
    throw new Error('Custom navigation is not defined for this tenant');
  }

  const customNav: any = customNavigation.reduce((acc, item) => {
    if (item.type === NavigationItemTypeEnum.Core) {
      const componentName = CoreNavMap[item.id];

      // if there is no component name or the component is not defined in screensProps, skip
      if (!componentName || !screensProps[componentName]) {
        console.warn('Missing Core Navigation Item map for:', item.id);
        return acc;
      }
      acc[componentName] = screensProps[componentName];
      if (item.name) {
        if (acc[componentName].options) {
          acc[componentName].options.title = item.name;
        } else {
          acc[componentName].options = {
            title: item.name,
          };
        }
      }
    } else {
      acc[item.id] = {
        name: item.id,
        component: NullCmp,
        options: { title: item.name },
        listeners: {
          drawerItemPress: e => {
            item.url && openUrlService.open(item.url);
            e.preventDefault();
          },
        },
      };
    }
    return acc;
  }, {});

  customNav.Notifications = screensProps['Notifications'];

  customNav.Settings = screensProps['Settings'];

  return customNav;
}

const CoreNavMap = {
  newsfeed: 'Newsfeed',
  groups: 'Groups',
  boost: 'Boosts',
  explore: 'Explore',
  chat: 'ChatListStack',
  notifications: 'Notifications',
  channel: 'Profile',
};

export const CoreToCustomMap = invert(CoreNavMap);
