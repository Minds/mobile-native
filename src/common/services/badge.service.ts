//@ts-nocheck
import push from './push.service';

/**
 * Badge service
 */
class BadgeService {
  unreadNotifications = 0;

  setUnreadNotifications(val) {
    this.unreadNotifications = val;
    this.updateBadge();
  }

  updateBadge() {
    push.setBadgeCount(this.unreadNotifications);
  }
}

export default new BadgeService();
