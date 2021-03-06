import { Linking, Platform } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { showNotification } from '../../AppMessages';
import apiService from '../common/services/api.service';
import i18nService from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import mindsService from '../common/services/minds.service';
import { ANDROID_CHAT_APP } from '../config/Config';

const createChatStore = () => ({
  unreadCount: 0,
  chatUrl: '',
  inProgress: false,
  createInProgress: false,
  polling: 0,
  async checkAppInstalled(openStore = true) {
    try {
      const installed = await SendIntentAndroid.isAppInstalled(
        ANDROID_CHAT_APP,
      );
      if (!installed && openStore) {
        Linking.openURL('market://details?id=com.minds.chat');
      }
      return installed;
    } catch (error) {
      logService.exception(error);
      console.log(error);
      return false;
    }
  },
  async openChat() {
    if (Platform.OS === 'android') {
      const installed = await this.checkAppInstalled();
      if (!installed) {
        return;
      }
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
    this.loadCount();
    const chatUrl = (await mindsService.getSettings()).matrix?.chat_url;
    if (chatUrl) {
      this.chatUrl = chatUrl;
    }
    this.polling = setInterval(this.loadCount, 15000);
  },
  async loadCount(): Promise<void> {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    try {
      const response: any = await apiService.get('api/v3/matrix/total-unread');
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
      const response: any = await apiService.put(`api/v3/matrix/room/${guid}`);
      if (!response.room || !response.room.id) {
        throw new Error('Error: api/v3/matrix/room failed');
      }
      Linking.openURL(`${this.chatUrl}/#/room/${response.room.id}`);
    } catch (err) {
      showNotification(i18nService.t('messenger.errorDirectMessage'));
    } finally {
      this.createInProgress = false;
    }
  },
  clear() {
    if (this.polling) {
      clearInterval(this.polling);
    }
  },
});

export default createChatStore;
export type ChatStoreType = ReturnType<typeof createChatStore>;
