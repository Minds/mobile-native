import moment from 'moment';
import { storages } from './storage/storages.service';

const VALUE_KEY = 'referrer';
const TIMESTAMP_KEY = 'referrer_ts';

class ReferrerService {
  public set(referrer: string): void {
    storages.app.setString(VALUE_KEY, referrer);
    storages.app.setInt(TIMESTAMP_KEY, Date.now());
  }

  public clear(): void {
    storages.app.setString(VALUE_KEY, '');
    storages.app.setInt(TIMESTAMP_KEY, 0);
  }

  /**
   * returns the referrer while also handling the expiration
   */
  public get(): string | undefined {
    const referrer = storages.app.getString(VALUE_KEY);
    const referrerTimestamp = storages.app.getInt(TIMESTAMP_KEY);

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
