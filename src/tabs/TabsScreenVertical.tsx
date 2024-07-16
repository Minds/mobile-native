import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerNavigationOptions,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import MIcon from '@expo/vector-icons/MaterialIcons';
import { Icon as NIcon } from 'react-native-elements';
import { View, Platform, TouchableOpacity } from 'react-native';

import { H4 } from '~/common/ui';
import { Icon } from '~ui/icons';
import { IS_TENANT } from '~/config/Config';

import { IconMapNameType } from '~/common/ui/icons/map';
import DiscoveryIcon from '../discovery/v2/DiscoveryTabIcon';
import preventDoubleTap from '~/common/components/PreventDoubleTap';
import { pushComposeCreateScreen } from '../compose/ComposeCreateScreen';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import {
  CustomNavigationItem,
  CustomNavigationItems,
  useCustomNavigation,
} from '~/modules/navigation/service/custom-navigation.service';
import useIsPortrait from '~/common/hooks/useIsPortrait';
import {
  CoreToCustomMap,
  useVerticalScreenProps,
} from './hooks/useVerticalScreenProps';
import sp from '~/services/serviceProvider';

const DoubleTapSafeButton = preventDoubleTap(TouchableOpacity);

export type DrawerParamList = {
  Newsfeed: {};
  Explore: {};
  ChatListStack: {};
  MindsPlus: {};
  Notifications: {};
  Profile: {};
  More: {};
  Boosts: {};
  Supermind: {};
  Wallet: {};
  AffiliateProgram: {};
  Groups: {};
  Settings: {};
  GroupView: {};
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const ComposeButton = () => (
  <View style={styles.editIcon}>
    <NIcon
      name="edit"
      type="material"
      size={24}
      color={sp.styles.getColor('PrimaryBackground')}
    />
  </View>
);

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = React.memo(function () {
  const theme = sp.styles.style;
  const isPortrait = useIsPortrait();

  const customNavigation = useCustomNavigation();

  const screensProps = useVerticalScreenProps(customNavigation);

  return (
    <View style={theme.flexContainer}>
      <Drawer.Navigator
        detachInactiveScreens={Platform.OS === 'android'}
        initialRouteName="Newsfeed"
        defaultStatus="open"
        drawerContent={DrawerContent}
        screenOptions={props =>
          drawerOptions({ ...props, isPortrait, customNavigation })
        }>
        {Object.entries(screensProps).map(([key, props]) => {
          // @ts-ignore
          return <Drawer.Screen name={key} key={key} {...props} />;
        })}
      </Drawer.Navigator>
    </View>
  );
});

type DrawerContentProps = DrawerNavigationOptions;
const drawerOptions = ({
  route,
  isPortrait,
  customNavigation,
}: {
  route: any;
  isPortrait?: boolean;
  customNavigation: CustomNavigationItems;
}): DrawerContentProps => {
  const navMap: { [key: string]: CustomNavigationItem } | undefined =
    customNavigation?.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

  return {
    headerShown: false,
    drawerType: 'permanent',
    drawerStyle: {
      width: isPortrait ? 78 : 270,
    },
    drawerActiveTintColor: sp.styles.getColor('PrimaryText'),
    overlayColor: 'transparent',
    lazy: true,
    drawerLabelStyle,
    drawerIcon: ({ focused }) => {
      if (route.name === 'Explore') {
        return (
          <DiscoveryIcon
            size="large"
            icon={navMap?.explore?.iconId}
            active={focused}
            style={styles.icon}
          />
        );
      }
      if (route.name === 'Notifications') {
        return (
          <NotificationIcon size="large" active={focused} style={styles.icon} />
        );
      }

      if (customNavigation) {
        const coreName = CoreToCustomMap[route.name];
        const name = coreName || route.name;
        const iconName = navMap?.[name]?.iconId;
        if (iconName) {
          return iconName ? (
            <MIcon
              size={28}
              // @ts-ignore
              name={iconName.replace('_', '-')}
              style={[
                styles.icon,
                focused
                  ? sp.styles.style.colorPrimaryText
                  : sp.styles.style.colorIcon,
              ]}
            />
          ) : null;
        }
      }

      return (
        <Icon
          size="large"
          active={focused}
          name={iconFromRoute[route.name]}
          activeColor="PrimaryText"
          style={styles.icon}
        />
      );
    },
  };
};

const drawerLabelStyle = {
  paddingLeft: 8,
  fontSize: 16,
};

/**
 * Drawer component
 */
function DrawerContent(props) {
  const isPortrait = useIsPortrait();
  const { navigation } = props;
  const pushComposeCreate = () =>
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        navigation.navigate('Compose', { createMode: key });
      },
    });

  const handleComposePress = () => {
    navigation.push('Compose');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DoubleTapSafeButton
        onLongPress={IS_TENANT ? undefined : handleComposePress}
        onPress={IS_TENANT ? handleComposePress : pushComposeCreate}
        style={styles.composeButton}
        delayLongPress={200}>
        <ComposeButton />
        {isPortrait ? undefined : (
          <H4 horizontal="XXL" vertical="L">
            {'Compose'}
          </H4>
        )}
      </DoubleTapSafeButton>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export const styles = sp.styles.create({
  editIcon: [
    'bgIconActive',
    {
      marginLeft: 12,
      padding: 14,
      borderRadius: 60,
    },
  ],
  composeButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 4,
  },
});

const iconFromRoute: Record<string, IconMapNameType> = {
  More: 'menu',
  Newsfeed: 'home',
  ChatListStack: 'chat',
  User: 'user',
  Discovery: 'search',
  Profile: 'profile',
  Boosts: 'boost',
  Supermind: 'supermind',
  Wallet: 'bank',
  Analytics: 'analytics',
  AffiliateProgram: 'affiliate',
  MindsPlus: 'queue',
  Groups: 'group',
  Settings: 'cog',
};

export default Tabs;
