//@ts-nocheck
import React, { useCallback } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { View, StyleSheet, Platform } from 'react-native';

import IconIon from 'react-native-vector-icons/Ionicons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MessageType, Icon } from 'react-native-flash-message';

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
  switch (icon) {
    case 'success':
      return (
        <View style={styles.success}>
          <IconIon name="md-checkmark" color="white" size={25} />
        </View>
      );
    case 'info':
      return (
        <View style={styles.info}>
          <IconAnt name="exclamationcircleo" color="white" size={25} />
        </View>
      );
    case 'warning':
      return (
        <View style={styles.warning}>
          <IconIon name="ios-warning" color="white" size={25} />
        </View>
      );
    case 'danger':
      return (
        <View style={styles.danger}>
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
      renderCustomContent={renderNotification}
      renderFlashMessageIcon={renderNotificationIcon}
    />
  );
};

const styles = StyleSheet.create({
  info: {
    backgroundColor: '#5A91BB',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#59A05E',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  danger: {
    backgroundColor: '#CA4A34',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    backgroundColor: '#D49538',
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
