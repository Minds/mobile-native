import { Linking, Platform } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import type { Timeout } from '~/types/Common';
import { showNotification } from '../../AppMessages';
import { ANDROID_CHAT_APP } from '../config/Config';
import sp from '~/services/serviceProvider';

const createChatStore = () => ({
  unreadCount: 0,
  chatUrl: '',
  inProgress: false,
  createInProgress: false,
  polling: <Timeout | 0>0,
  // hasSeenModal: false,
  async checkAppInstalled(openStore = true) {
    try {
      let installed = false;
      if (Platform.OS === 'android') {
        installed = await SendIntentAndroid.isAppInstalled(ANDROID_CHAT_APP);
        if (!installed && openStore) {
          Linking.openURL('market://details?id=com.minds.chat');
        }
      } else {
        try {
          installed = await Linking.canOpenURL('mindschat:mindschat');
        } catch (error) {}
        if (!installed && openStore) {
          Linking.openURL(
            'https://itunes.apple.com/us/app/keynote/id1562887434?mt=8',
          );
        }
      }
      return installed;
    } catch (error) {
      sp.log.exception(error);
      console.log(error);
      return false;
    }
  },
  async openChat() {
    const installed = await this.checkAppInstalled();
    if (!installed) {
      return;
    }
    if (this.chatUrl) {
      if (Platform.OS === 'ios') {
        Linking.openURL(this.chatUrl);
      } else {
        SendIntentAndroid.openApp(ANDROID_CHAT_APP, {});
      }
    }
  },
  async init() {
    const chatUrl = sp.config.getSettings().matrix?.chat_url;
    if (chatUrl) {
      this.chatUrl = chatUrl;
    }
    this.reset();
    // TODO: to hook to another event if needed.
    // this.polling = setInterval(this.loadCount, 15000);
    this.loadCount();
  },
  async loadCount(): Promise<void> {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    try {
      const response: any = await sp.api.get('api/v3/matrix/total-unread');
      const unread = Number(response?.total_unread);
      if (unread !== this.unreadCount) {
        this.unreadCount = unread;
      }
    } catch (err) {
    } finally {
      this.inProgress = false;
    }
  },
  async directMessage(guid: string): Promise<void> {
    if (this.createInProgress) {
      return;
    }
    this.createInProgress = true;
    try {
      const response: any = await sp.api.put(`api/v3/matrix/room/${guid}`);
      if (!response.room || !response.room.id) {
        throw new Error('Error: api/v3/matrix/room failed');
      }
      Linking.openURL(`${this.chatUrl}/#/room/${response.room.id}`);
    } catch (err) {
      showNotification(sp.i18n.t('messenger.errorDirectMessage'));
    } finally {
      this.createInProgress = false;
    }
  },
  reset() {
    if (this.polling) {
      clearInterval(this.polling);
    }
  },
});

export default createChatStore;
export type ChatStoreType = ReturnType<typeof createChatStore>;
