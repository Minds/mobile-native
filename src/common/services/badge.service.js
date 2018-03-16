import push from './push.service';

/**
 * Badge service
 */
class BadgeService {
  unreadConversations = 0;
  unreadNotifications = 0;

  setUnreadNotifications(val) {
    this.unreadNotifications = val;
    this.updateBadge();
  }

  setUnreadConversations(val) {
    this.unreadConversations = val;
    this.updateBadge();
  }

  updateBadge() {
    push.setBadgeCount(this.unreadConversations + this.unreadNotifications);
  }
}

export default new BadgeService();