import React, { useCallback } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { View, StyleSheet, Platform } from 'react-native';

import IconIon from 'react-native-vector-icons/Ionicons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MessageType, Icon } from 'react-native-flash-message';
import ThemedStyles from './src/styles/ThemedStyles';

/**
 *  Show a notification message to the user
 * @param message
 * @param type
 * @param duration use 0 for permanent message
 */
export const showNotification = (
  message: string,
  type: MessageType = 'info',
  duration: number = 2000,
) => {
  showMessage({
    floating: true,
    position: 'top',
    message,
    icon: type,
    duration,
    backgroundColor: '#FFFFFF',
    //@ts-ignore style parameter is not defined on the type
    style: styles.container,
    titleStyle: styles.title,
    color: '#7D7D82',
    type,
  });
};

/**
 * Icon renderer
 * @param icon
 */
const renderNotificationIcon = (icon: Icon = 'success') => {
  const theme = ThemedStyles.style;
  switch (icon) {
    case 'success':
      return (
        <View style={[styles.success, theme.backgroundSuccess]}>
          <IconIon name="md-checkmark" color="white" size={25} />
        </View>
      );
    case 'info':
      return (
        <View style={[styles.info, theme.backgroundInfo]}>
          <IconAnt name="exclamationcircleo" color="white" size={25} />
        </View>
      );
    case 'warning':
      return (
        <View style={[styles.warning, theme.backgroundWarning]}>
          <IconIon name="ios-warning" color="white" size={25} />
        </View>
      );
    case 'danger':
      return (
        <View style={[styles.danger, theme.backgroundDanger]}>
          <IconMC name="alert-octagon" color="white" size={25} />
        </View>
      );
  }
  return null;
};

/**
 * App messages component
 */
const AppMessages = () => {
  const renderNotification = useCallback(
    (message: any) =>
      message.renderCustomContent ? message.renderCustomContent() : null,
    [],
  );
  return (
    <FlashMessage
      //@ts-ignore renderCustomContent prop is not defined on the type
      renderCustomContent={renderNotification}
      renderFlashMessageIcon={renderNotificationIcon}
    />
  );
};

const styles = StyleSheet.create({
  info: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  danger: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    padding: 15,
    paddingRight: 15,
    marginRight: 50,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  container: {
    shadowColor: 'black',
    shadowOpacity: Platform.select({ ios: 0.2, android: 0.3 }),
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 15,
    alignItems: 'center',
    minHeight: 70,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
});

export default AppMessages;
