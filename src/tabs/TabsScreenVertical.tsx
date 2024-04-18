import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerNavigationOptions,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { View, Platform, TouchableOpacity } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import { Icon } from '~ui/icons';
import NotificationIcon from '../notifications/v3/notifications-tab-icon/NotificationsTabIcon';
import DiscoveryIcon from '../discovery/v2/DiscoveryTabIcon';
import { observer } from 'mobx-react';
import preventDoubleTap from '~/common/components/PreventDoubleTap';
import NewsfeedStack from '~/navigation/NewsfeedStack';
import DiscoveryStack from '~/navigation/DiscoveryStack';
import NotificationsStack from '../navigation/NotificationsStack';
import { IconMapNameType } from '~/common/ui/icons/map';
import { pushComposeCreateScreen } from '../compose/ComposeCreateScreen';
import { Icon as NIcon } from 'react-native-elements';
import { H4 } from '~/common/ui';
import { useDimensions } from '@react-native-community/hooks';
import MoreStack from '~/navigation/MoreStack';
import sessionService from '~/common/services/session.service';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IS_TENANT } from '~/config/Config';

const DoubleTapSafeButton = preventDoubleTap(TouchableOpacity);

export type DrawerParamList = {
  Newsfeed: {};
  Explore: {};
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

export type GroupStackParamList = {
  Groups: {};
  GroupView: {};
};

const Drawer = createDrawerNavigator<DrawerParamList>();
const GroupStackNav = createNativeStackNavigator<GroupStackParamList>();

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function () {
  const theme = ThemedStyles.style;
  const { width, height } = useDimensions().window;
  const channel = sessionService.getUser();
  const isPortrait = height > width;

  return (
    <View style={theme.flexContainer}>
      <Drawer.Navigator
        detachInactiveScreens={Platform.OS === 'android'}
        initialRouteName="Newsfeed"
        defaultStatus="open"
        drawerContent={props => (
          <DrawerContent
            {...{
              isPortrait,
              ...props,
            }}
          />
        )}
        screenOptions={props => drawerOptions({ ...props, isPortrait })}>
        <Drawer.Screen
          name="Newsfeed"
          component={NewsfeedStack}
          options={{ lazy: false }}
        />
        <Drawer.Screen
          name="Explore"
          component={DiscoveryStack}
          options={{ lazy: false }}
        />
        <Drawer.Screen name="Notifications" component={NotificationsStack} />
        <Drawer.Screen
          name="Profile"
          getComponent={() => require('~/channel/v2/ChannelScreen').default}
          initialParams={{ entity: channel }}
        />
        {!IS_TENANT && (
          <>
            <Drawer.Screen
              name="Boosts"
              getComponent={() => require('modules/boost').BoostConsoleScreen}
            />
            <Drawer.Screen //*** disabled for iOS ***
              name="MindsPlus"
              getComponent={() =>
                require('~/discovery/v2/PlusDiscoveryScreen').default
              }
            />
            <Drawer.Screen
              name="Supermind"
              getComponent={() =>
                require('~/supermind/SupermindConsoleScreen').default
              }
            />
            <Drawer.Screen
              name="Wallet"
              getComponent={() => require('~/wallet/v3/WalletScreen').default}
            />
            <Drawer.Screen
              name="AffiliateProgram"
              getComponent={() =>
                require('modules/affiliate/screens/AffiliateProgramScreen')
                  .default
              }
              options={{
                drawerLabel: 'Affiliate Program',
              }}
            />
          </>
        )}
        <Drawer.Screen name="Groups" component={GroupStack} />
        <Drawer.Screen name="Settings" component={MoreStack} />
      </Drawer.Navigator>
    </View>
  );
});

type DrawerContentProps = DrawerNavigationOptions & {
  isPortrait?: boolean;
};
const drawerOptions = ({ route, isPortrait }): DrawerContentProps => {
  return {
    headerShown: false,
    drawerType: 'permanent',
    drawerStyle: {
      width: isPortrait ? 78 : 270,
    },
    drawerActiveTintColor: ThemedStyles.getColor('PrimaryText'),
    overlayColor: 'transparent',
    lazy: true,
    drawerLabelStyle: {
      paddingLeft: 8,
      fontSize: 16,
    },
    drawerIcon: ({ focused }) => {
      if (route.name === 'Explore') {
        return (
          <DiscoveryIcon size="large" active={focused} style={styles.icon} />
        );
      }
      if (route.name === 'Notifications') {
        return (
          <NotificationIcon size="large" active={focused} style={styles.icon} />
        );
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

function DrawerContent(props) {
  const { navigation, isPortrait } = props;
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

const ComposeButton = () => (
  <View style={styles.editIcon}>
    <NIcon
      name="edit"
      type="material"
      size={24}
      color={ThemedStyles.getColor('PrimaryBackground')}
    />
  </View>
);

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

export const styles = ThemedStyles.create({
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
