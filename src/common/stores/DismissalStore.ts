import debounce from 'lodash/debounce';
import { action, observable } from 'mobx';
import { storages } from '../services/storage/storages.service';

const DEFAULT_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export type DismissIdentifier =
  | 'top-highlights'
  | 'channel-recommendation:feed'
  | 'channel-recommendation:channel';

type DismissItem = {
  id: DismissIdentifier;
  expiry: number;
};

/**
 * A general service to manage dismissal of components, widgets, or notices
 */
export class DismissalStore {
  static STORAGE_KEY = 'dismissal-service:dismisses';

  @observable
  private dismisses: DismissItem[] = [];

  constructor() {
    setTimeout(() => this._rehydrate(), 0);
    this._persist = debounce(this._persist, 200);
  }

  /**
   * Whether an item is dismissed
   * @param { DismissIdentifier } id
   * @returns { Observable<boolean> }
   */
  isDismissed(id: DismissIdentifier): boolean {
    return this.dismisses
      .filter(item => Date.now() <= item.expiry)
      .map(item => item.id)
      .includes(id);
  }

  /**
   * Dismisses an item for some time
   * @param { string } id - a unique id
   * @param { number } duration - a duration in milliseconds until which this item shouldn't be shown
   */
  @action
  dismiss(id: DismissIdentifier, duration: number = DEFAULT_DURATION) {
    this.dismisses = [...this.dismisses, { id, expiry: Date.now() + duration }];
    this._persist(this.dismisses);
  }

  /**
   * Restores state from localstorage
   */
  @action
  private _rehydrate(): void {
    try {
      const dismisses: DismissItem[] =
        storages.user?.getArray(DismissalStore.STORAGE_KEY) || [];
      this.dismisses = dismisses.filter(
        item => item.expiry >= Date.now(),
      ) as DismissItem[];
      // discard expired dismisses
      this._persist(this.dismisses);
    } catch (e) {
      console.error(
        '[DismissalStore] something went wrong while rehydrating',
        e,
      );
    }
  }

  /**
   * Watches the dismisses$ and persists its state by writing to localstorage
   */
  private _persist(dismisses): void {
    try {
      storages.user?.setArray(DismissalStore.STORAGE_KEY, dismisses);
    } catch (e) {
      console.error(
        '[DismissalStore] something went wrong while rehydrating',
        e,
      );
    }
  }

  /**
   * Reset the store
   */
  @action
  reset() {
    this.dismisses = [];
    setTimeout(() => this._rehydrate(), 0);
  }
}
