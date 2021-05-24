import apiService from '../../common/services/api.service';
import logService from '../../common/services/log.service';

export type FilterType = '' | 'tags';

const createNotificationsStore = () => ({
  unread: 0,
  filter: '' as FilterType,
  offset: '',
  setOffset(offset: string) {
    this.offset = offset;
  },
  setFilter(filter: FilterType) {
    this.filter = filter;
  },
  setUnread(unread: number) {
    this.unread = unread;
  },
  async loadUnreadCount() {
    try {
      const response = <any>(
        await apiService.get('api/v3/notifications/unread-count', {})
      );
      if (response.count) {
        this.setUnread(response.count);
      }
    } catch (err) {
      logService.exception('[NotificationsStore] unread-count', err);
    }
  },
});

export default createNotificationsStore;
export type NotificationsStore = ReturnType<typeof createNotificationsStore>;
