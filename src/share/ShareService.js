import Share from 'react-native-share';

/**
 * Share service
 */
class ShareService {

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
    // added a settimeout as a workaround for ios, without it the share dialog is not shown
    setTimeout(async () => {
      try {
        await Share.open({
          title: title,
          message: url,
        });
      } catch (err) {
        console.log(err);
      }
    }, 600);
  }
}

export default new ShareService();
