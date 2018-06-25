import SmsListener from 'react-native-android-sms-listener'
import permissions from './android-permissions.service';
import KeepAwake from 'react-native-keep-awake';

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
      KeepAwake.activate();
      return await new Promise(resolve => {
        let subscription = SmsListener.addListener(message => {
          if (regex.test(message.body)) {
            let verificationCode = message.body.match(regex)[1]
            resolve(verificationCode);
            subscription.remove();
            KeepAwake.deactivate();
          }
        });

        setTimeout(() => {
          subscription.remove();
          resolve(false);
          KeepAwake.deactivate();
        }, timeout);
      });
    } else {
      return -1; //not allowed
    }
  }

}

export default new SmsListenerService();