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
import { storages } from '../common/services/storage/storages.service';
import { triggerHaptic } from '../common/services/haptic.service';
import { Icon as NIcon } from 'react-native-elements';
import { H4 } from '~/common/ui';
import { useDimensions } from '@react-native-community/hooks';
import MoreStack from '~/navigation/MoreStack';

const DoubleTapSafeButton = preventDoubleTap(TouchableOpacity);

export type DrawerParamList = {
  Newsfeed: {};
  Discovery: {};
  More: {};
  Notifications: {};
  Boosts: {};
  MindsPlus: {};
  Supermind: {};
  Wallet: {};
  Analytics: {};
  AffiliateProgram: {};
  Groups: {};
  Settings: {};
};

const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function () {
  const theme = ThemedStyles.style;
  const { width, height } = useDimensions().window;
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
          name="Discovery"
          component={DiscoveryStack}
          options={{ lazy: false }}
        />
        <Drawer.Screen name="Notifications" component={NotificationsStack} />
        <Drawer.Screen
          name="MindsPlus"
          getComponent={() =>
            require('~/discovery/v2/PlusDiscoveryScreen').default
          }
        />
        <Drawer.Screen
          name="Boosts"
          getComponent={() => require('modules/boost').BoostConsoleScreen}
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
            require('modules/affiliate/screens/AffiliateProgramScreen').default
          }
          options={{
            drawerLabel: 'Affiliate Program',
          }}
        />
        <Drawer.Screen
          name="Groups"
          getComponent={() => require('~/groups/GroupsListScreen').default}
        />
        <Drawer.Screen
          name="Analytics"
          getComponent={() => require('~/analytics/AnalyticsScreen').default}
        />
        <Drawer.Screen name="Settings" component={MoreStack} />
      </Drawer.Navigator>
    </View>
  );
});

type DrawerContentProps = DrawerNavigationOptions & {
  isPortrait?: boolean;
};
const drawerOptions = ({ route, isPortrait }): DrawerContentProps => ({
  headerShown: false,
  drawerType: 'permanent',
  drawerStyle: { width: isPortrait ? 78 : 270 },
  overlayColor: 'transparent',
  lazy: true,
  drawerLabelStyle: {
    fontSize: 16,
  },
  drawerIcon: ({ focused }) => {
    if (route.name === 'Discovery') {
      return <DiscoveryIcon size="huge" active={focused} />;
    }
    if (route.name === 'Notifications') {
      return <NotificationIcon size="huge" active={focused} />;
    }
    return (
      <Icon
        size="huge"
        active={focused}
        name={iconFromRoute[route.name]}
        activeColor="PrimaryText"
      />
    );
  },
});

function DrawerContent(props) {
  const { navigation, isPortrait } = props;
  const handleComposePress = () => {
    if (storages.user?.getBool('compose:create')) {
      return navigation.push('Compose');
    }
    pushComposeCreate();
  };

  const pushComposeCreate = () =>
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        storages.user?.setBool('compose:create', true);
        navigation.navigate('Compose', { createMode: key });
      },
    });

  const handleComposeLongPress = () => {
    triggerHaptic();
    pushComposeCreate();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DoubleTapSafeButton
        onPress={handleComposePress}
        onLongPress={handleComposeLongPress}
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
});

const iconFromRoute: Record<string, IconMapNameType> = {
  More: 'menu',
  Newsfeed: 'home',
  User: 'user',
  Discovery: 'search',
  Boosts: 'boost',
  Supermind: 'supermind',
  Wallet: 'bank',
  Analytics: 'analytics',
  AffiliateProgram: 'share-social',
  MindsPlus: 'plus-circle-outline',
  Groups: 'group',
  Settings: 'cog',
};

export default Tabs;
