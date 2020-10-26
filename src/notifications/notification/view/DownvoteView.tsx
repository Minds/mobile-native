import LikeView from './LikeView';
import i18n from '../../../common/services/i18n.service';

/**
 * Downvote Notification Component
 */
export default class DownvoteView extends LikeView {
  /**
   * Get translated message
   */
  getMessage() {
    return i18n.t('notification.downVoted');
  }
}
