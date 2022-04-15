import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle, EventType } from '@notifee/react-native';

/**
 * Handle received push messages
 */
const onMessageReceived = async message => {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  // console.log('channelId', channelId);
  await notifee.displayNotification({
    id: message.data.tag,
    title: message.data.title,
    body: message.data.body,
    data: message.data,
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: false,
      },
      attachments: message.data.largeIcon
        ? [{ url: message.data.largeIcon }]
        : [],
    },
    android: {
      tag: message.data.tag,
      channelId,
      smallIcon: '@drawable/ic_stat_name',
      largeIcon: message.data.largeIcon,
      badgeCount: parseInt(message.data.badge, 10),
      pressAction: {
        id: 'default',
      },
      style: message.data.bigPicture
        ? {
            type: AndroidStyle.BIGPICTURE,
            picture: message.data.bigPicture,
          }
        : undefined,
    },
  });
};

// Register the handlers for the push notifications foreground and background
messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().onMessage(onMessageReceived);

notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
    console.log(
      'Fore: User pressed an action with the id: ',
      detail.pressAction.id,
    );
    console.log(detail);
  }
});
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
    console.log(
      'Back: User pressed an action with the id: ',
      detail.pressAction.id,
    );
    console.log(detail);
  }
});
