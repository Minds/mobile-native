import { Linking } from 'react-native';
import { showNotification } from '../../AppMessages';
import apiService from '../common/services/api.service';
import i18nService from '../common/services/i18n.service';
import mindsService from '../common/services/minds.service';

const createChatStore = () => ({
  unreadCount: 0,
  chatUrl: '',
  inProgress: false,
  polling: 0,
  openChat() {
    if (this.chatUrl) {
      setTimeout(() => {
        Linking.openURL(this.chatUrl);
      }, 100);
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
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    try {
      const response: any = await apiService.put(`api/v3/matrix/room/${guid}`);
      if (!response.room || !response.room.id) {
        throw new Error('Error: api/v3/matrix/room failed');
      }
      Linking.openURL(`${this.chatUrl}/#/room/${response.room.id}`);
    } catch (err) {
      showNotification(i18nService.t('messenger.errorDirectMessage'));
    } finally {
      this.inProgress = false;
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
