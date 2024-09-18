import { ToastConfig } from '@msantang78/react-native-styled-toast/dist/Toast';
import sp from '~/services/serviceProvider';
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
        iconName: 'checkmark',
      };
    case 'warning':
      return {
        iconColor: '#D49538',
        iconFamily: 'Ionicons',
        iconName: 'warning',
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
  onPress?: () => void,
) => {
  if (toast) {
    toast({
      closeIconColor: sp.styles.getColor('SecondaryText'),
      message,
      onPress,
      hideAccent: true,
      shouldVibrate,
      allowFontScaling: false,
      // hideCloseIcon: true,
      duration,
      subMessage,
      ...getIcon(type),
      closeIconSize: 18,
      messageProps: {
        fontFamily: 'Roboto_500Medium',
        fontSize: 15,
      },
      iconSize: 24,
      toastStyles: {
        borderRadius: 4,
      },
      shadow: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,

        elevation: 4,
      },
    });
  }
};
