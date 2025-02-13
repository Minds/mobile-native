import { Share } from 'react-native';
import { pushBottomSheet } from '../common/components/bottom-sheet';

/**
 * Share service
 */
export class ShareService {
  /**
   * Invite
   * @param {string} referrer guid
   */
  invite(guid) {
    const url = 'https://www.minds.com/register?referrer=' + guid;
    const title = 'Join me on Minds.com';

    this.share(title, url);
  }

  /**
   * Share
   * @param {string} title
   * @param {string} url
   */
  share(title, url) {
    // added this because if tittle (activity text) is too long, causes problem in android
    title = title.length > 50 ? title.substring(0, 46) + '...' : title;

    // added a settimeout as a workaround for ios, without it the share dialog is not shown
    setTimeout(async () => {
      // using a fake bottom sheet to have an easier way to track the visibility of the share sheet
      pushBottomSheet({
        component: ref => {
          Share.share(
            { url, message: url },
            {
              dialogTitle: title,
            },
          )
            .catch(err => console.error(err))
            .finally(() => ref.close());

          return null;
        },
      });
    }, 30);
  }
}
