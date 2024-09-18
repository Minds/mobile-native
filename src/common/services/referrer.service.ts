import moment from 'moment';
import type { Storages } from './storage/storages.service';

const VALUE_KEY = 'referrer';
const TIMESTAMP_KEY = 'referrer_ts';

export class ReferrerService {
  constructor(private storages: Storages) {}

  public set(referrer: string): void {
    this.storages.app.set(VALUE_KEY, referrer);
    this.storages.app.set(TIMESTAMP_KEY, Date.now());
  }

  public clear(): void {
    this.storages.app.set(VALUE_KEY, '');
    this.storages.app.set(TIMESTAMP_KEY, 0);
  }

  /**
   * returns the referrer while also handling the expiration
   */
  public get(): string | undefined {
    const referrer = this.storages.app.getString(VALUE_KEY);
    const referrerTimestamp = this.storages.app.getNumber(TIMESTAMP_KEY);

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
