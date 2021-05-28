import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import NewsfeedScreen from '~/newsfeed/NewsfeedScreen';
import NotificationsScreen from '~/notifications/NotificationsScreen';
import ThemedStyles from '~/styles/ThemedStyles';
import NotificationIcon from '~/notifications/NotificationsTabIcon';
import gatheringService from '~/common/services/gathering.service';
import { observer } from 'mobx-react';
import { DiscoveryV2Screen } from '~/discovery/v2/DiscoveryV2Screen';
import ComposeIcon from '~/compose/ComposeIcon';
import Topbar from '~/topbar/Topbar';
import Icon from '~/common/components/icons/Icon';
import { InternalStack } from '~/navigation/NavigationStack';
import { GOOGLE_PLAY_STORE } from '~/config/Config';
import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import ChatTabIcon from '~/chat/ChatTabIcon';
import navigationService from '~/navigation/NavigationService';
import TabBar from './TabBar';
import { ICON_SIZE, SPACING, IS_TABLET } from '~/styles/Tokens';

export type TabParamList = {
  Newsfeed: {};
  User: {};
  Discovery: {};
  MessengerTab: {};
  Notifications: {};
  CaptureTab: {};
};

const Tab = createBottomTabNavigator<TabParamList>();

const Discovery = GOOGLE_PLAY_STORE
  ? () => {
      const theme = ThemedStyles.style;
      return (
        <View style={[theme.flexContainer, theme.centered, theme.padding4x]}>
          <Text style={[theme.fontXL, theme.textCenter]}>
            {i18n.t('postCantBeShown')}
          </Text>
        </View>
      );
    }
  : DiscoveryV2Screen;

/**
 * Main tabs
 * @param {Object} props
 */
const Tabs = observer(function ({ navigation }) {
  const theme = ThemedStyles.style;

  const navToCapture = useCallback(() => navigation.push('Capture'), [
    navigation,
  ]);

  const navToVideoCapture = useCallback(
    () => navigation.push('Capture', { mode: 'video', start: true }),
    [navigation],
  );

  if (gatheringService.inGatheringScreen) {
    return null;
  }

  const messenger = (
    <Tab.Screen
      name="MessengerTab"
      component={empty}
      options={messengerOptions}
    />
  );

  const discovery = (
    <Tab.Screen
      name="Discovery"
      component={Discovery}
      options={discoveryOptions}
    />
  );

  const lastTab = GOOGLE_PLAY_STORE ? (
    <Tab.Screen name="User" component={empty} options={userOptions} />
  ) : (
    messenger
  );

  const secondTab = GOOGLE_PLAY_STORE ? messenger : discovery;

  return (
    <View style={theme.flexContainer}>
      <Topbar navigation={navigation} />
      <Tab.Navigator
        initialRouteName="Newsfeed"
        tabBar={tabBar}
        screenOptions={tabOptions}>
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          options={{ tabBarTestID: 'Menu tab button' }}
        />
        {secondTab}
        <Tab.Screen
          name="CaptureTab"
          component={InternalStack}
          options={{
            tabBarTestID: 'CaptureTabButton',
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={navToCapture}
                onLongPress={navToVideoCapture}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={notificationOptions}
        />
        {lastTab}
      </Tab.Navigator>
    </View>
  );
});

const styles = StyleSheet.create({
  compose: {
    width: SPACING.M * 3.5,
    height: SPACING.M * 3.5,
    marginTop: SPACING.XXS,
  },
});

const navToChannel = () =>
  navigationService.push('Channel', { entity: sessionService.getUser() });

const notificationOptions = { tabBarTestID: 'Notifications tab button' };
const messengerOptions = { tabBarTestID: 'Messenger tab button' };
const discoveryOptions = { tabBarTestID: 'Discovery tab button' };

const tabBar = props => <TabBar {...props} />;

const userOptions = {
  tabBarTestID: 'CaptureTabButton',
  tabBarButton: props => <TouchableOpacity {...props} onPress={navToChannel} />,
};
const empty = () => null;

const tabOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    const color = focused
      ? ThemedStyles.getColor('link')
      : ThemedStyles.getColor('secondary_text');
    let iconName;
    let iconsize = ICON_SIZE;

    switch (route.name) {
      case 'MessengerTab':
        return <ChatTabIcon color={color} />;
      case 'Newsfeed':
        iconName = 'home';
        break;
      case 'User':
        iconName = 'user';
        break;
      case 'Discovery':
        iconName = 'hashtag';
        break;
      case 'Notifications':
        return <NotificationIcon color={color} size={iconsize} />;
      case 'CaptureTab':
        return <ComposeIcon style={styles.compose} />;
    }

    if (IS_TABLET) {
      iconsize = Math.round(iconsize * 1.2);
    }

    return (
      <Icon name={iconName.replace(/md\-/, '')} color={color} size={iconsize} />
    );
  },
});

export default Tabs;
