import { observable, action } from 'mobx';
import crypto from '../../common/services/crypto.service';
import i18n from '../../common/services/i18n.service';
import AbstractModel from '../../common/AbstractModel';
import { MINDS_CDN_URI } from '../../config/Config';
import sessionService from '../../common/services/session.service';

/**
 * Message model
 */
export default class MessageModel extends AbstractModel {
  @observable decryptedMessage: string = '';
  @observable showDate: boolean = false;
  @observable sending: boolean = false;
  decrypted: boolean = false;
  message: string = '';
  time_created?: number;
  owner?: {
    guid: string;
  };
  avatarSource?: any;

  @action
  setMessage(value: string) {
    this.decryptedMessage = value;
  }

  @action
  setSending(value: boolean) {
    this.sending = value;
  }

  @action
  toggleShowDate = () => {
    this.showDate = !this.showDate;
  };

  /**
   * Assign values to obj
   * @param data any
   */
  assign(data: any) {
    super.assign(data);

    // decrypt on creation
    if (data.message && !data.decryptedMessage) {
      this.setMessage(i18n.t('messenger.decrypting'));
      this.decrypt();
    } else {
      this.decrypted = true;
    }

    if (data.owner) {
      this.avatarSource = {
        uri:
          MINDS_CDN_URI +
          'icon/' +
          this.owner!.guid +
          '/small' +
          (this.owner!.guid === sessionService.getUser().guid
            ? '/' + sessionService.getUser().icontime
            : ''),
      };
    }
  }

  /**
   * Decrypt message
   */
  async decrypt() {
    try {
      const msg = await crypto.decrypt(this.message);
      this.decrypted = true;
      this.setMessage(msg);
    } catch (err) {
      this.decrypted = false;
      this.setMessage(i18n.t('messenger.couldntDecrypt'));
    }
  }
}
