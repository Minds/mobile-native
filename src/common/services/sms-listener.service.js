import SmsListener from 'react-native-android-sms-listener'
import permissions from './android-permissions.service';

/**
 * Sms listener service
 */
class SmsListenerService {

  /**
   * listen for sms
   * @param {regex} regex
   * @param {integer} timeout
   */
  async listen(regex, timeout=5000) {

    let allowed = await permissions.checkReadSms();

    if (!allowed) allowed = await permissions.readSms();


    if (allowed) {
      return await new Promise(resolve => {
        let subscription = SmsListener.addListener(message => {
          if (regex.test(message.body)) {
            let verificationCode = message.body.match(regex)[1]
            resolve(verificationCode);
          }
        });

        setTimeout(() => {
          subscription.remove();
          resolve(false);
        }, timeout);
      });
    }
  }

}

export default new SmsListenerService();