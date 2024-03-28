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
import { observer } from 'mobx-react';
import preventDoubleTap from '~/common/components/PreventDoubleTap';
import { pushComposeCreateScreen } from '../compose/ComposeCreateScreen';
import { storages } from '../common/services/storage/storages.service';
import { triggerHaptic } from '../common/services/haptic.service';
import { Icon as NIcon } from 'react-native-elements';
import { H4 } from '~/common/ui';
import { useDimensions } from '@react-native-community/hooks';
import { getScreens, getIconName } from './dynamic-tabs';

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
const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function () {
  const theme = ThemedStyles.style;
  const { width, height } = useDimensions().window;
  // const channel = sessionService.getUser();
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
        {getScreens().map(screen => (
          <Drawer.Screen {...screen} />
        ))}
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
      if (route.name === 'Notifications') {
        return (
          <NotificationIcon size="large" active={focused} style={styles.icon} />
        );
      }
      return (
        <Icon
          size="large"
          active={focused}
          name={getIconName(route.name)}
          activeColor="PrimaryText"
          style={styles.icon}
        />
      );
    },
  };
};

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
  icon: {
    marginLeft: 4,
  },
});

// const iconFromRoute: Record<string, IconMapNameType> = {
//   Newsfeed: 'home',
//   Discovery: 'search',
//   MindsPlus: 'queue',
//   Profile: 'profile',
//   Boosts: 'boost',
//   Wallet: 'bank',
//   Analytics: 'analytics',
//   Supermind: 'supermind',
//   AffiliateProgram: 'affiliate',
//   User: 'user',
//   Groups: 'group',
//   Settings: 'cog',
//   More: 'menu',
// };

export default Tabs;
