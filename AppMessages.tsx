import ThemedStyles from './src/styles/ThemedStyles';
import { ToastConfig } from '@msantang78/react-native-styled-toast/dist/Toast';

let toast: undefined | ((config: ToastConfig) => void);

export function registerToast(t) {
  toast = t;
}

type MessageType = 'success' | 'info' | 'warning' | 'danger';

function getIcon(type: MessageType): any {
  switch (type) {
    case 'success':
      return {
        iconColor: '#59A05E',
        iconFamily: 'Ionicons',
        iconName: 'md-checkmark',
      };
    case 'warning':
      return {
        iconColor: '#D49538',
        iconFamily: 'Ionicons',
        iconName: 'ios-warning',
      };
    case 'info':
      return {
        iconColor: '#5282A7',
        iconFamily: 'EvilIcons',
        iconName: 'exclamation',
      };
    case 'danger':
      return {
        iconColor: '#CA4A34',
        iconFamily: 'MaterialCommunityIcons',
        iconName: 'alert-octagon',
      };
  }
  return {};
}

/**
 * Show a notification message to the user
 * @param message
 * @param type
 * @param duration
 * @param subMessage
 * @param shouldVibrate
 */
export const showNotification = (
  message: string,
  type: MessageType = 'info',
  duration: number = 2800,
  subMessage?: string,
  shouldVibrate = false,
) => {
  if (toast) {
    toast({
      closeIconColor: ThemedStyles.getColor('SecondaryText'),
      message,
      hideAccent: true,
      shouldVibrate,
      duration,
      subMessage,
      ...getIcon(type),
      closeIconSize: 22,
      messageProps: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        textAlign: 'center',
        numberOfLines: 2,
      },
      iconSize: 22,
      toastStyles: {
        alginItems: 'center',
        borderRadius: 4,
      },
      shadow: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
      },
    });
  }
};
