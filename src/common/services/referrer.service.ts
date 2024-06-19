import moment from 'moment';
import { storagesService } from '~/common/services';

const VALUE_KEY = 'referrer';
const TIMESTAMP_KEY = 'referrer_ts';

class ReferrerService {
  public set(referrer: string): void {
    storagesService.app.set(VALUE_KEY, referrer);
    storagesService.app.set(TIMESTAMP_KEY, Date.now());
  }

  public clear(): void {
    storagesService.app.set(VALUE_KEY, '');
    storagesService.app.set(TIMESTAMP_KEY, 0);
  }

  /**
   * returns the referrer while also handling the expiration
   */
  public get(): string | undefined {
    const referrer = storagesService.app.getString(VALUE_KEY);
    const referrerTimestamp = storagesService.app.getNumber(TIMESTAMP_KEY);

    if (
      referrer &&
      referrerTimestamp &&
      moment().isAfter(moment(referrerTimestamp).add({ days: 3 }))
    ) {
      this.clear();
      return;
    }

    return referrer || undefined;
  }
}

const referrerService = new ReferrerService();

export default referrerService;
