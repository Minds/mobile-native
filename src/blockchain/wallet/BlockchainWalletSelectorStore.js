import {
  observable,
  action,
  observe
} from 'mobx'

import { NavigationActions } from 'react-navigation';

import NavigationStoreService from '../../common/services/navigation.service';

let dispose;

const DEFAULT_OPTS = {
  signable: false,
  offchain: false,
  buyable: false,
};

/**
 * Blockchain Store
 */
class BlockchainWalletSelectorStore {

  @observable isSelecting = false;
  @observable selected = void 0;
  @observable selectMessage = '';
  @observable opts = false;

  @action async waitForSelect(message = '', opts = {}) {
    if (this.isSelecting) {
      throw new Error('E_ALREADY_SELECTING');
    }

    opts = Object.assign({}, DEFAULT_OPTS, opts);

    this.selected = void 0;
    this.selectMessage = message;
    this.opts = opts;
    this.isSelecting = true;

    NavigationStoreService.get().dispatch(NavigationActions.navigate({ routeName: 'BlockchainWalletModal' }));

    return await new Promise(resolve => {
      if (dispose) {
        dispose();
        dispose = void 0;
      }

      dispose = observe(this, 'selected', action(change => {
        if (typeof change.newValue !== 'undefined') {
          dispose();
          dispose = void 0;

          this.isSelecting = false;
          this.selected = void 0;
          this.selectMessage = '';
          this.opts = Object.assign({}, DEFAULT_OPTS);

          resolve(change.newValue);

          NavigationStoreService.get().dispatch(NavigationActions.back());
        }
      }));
    });
  }

  // For modal use only

  @action select(item) {
    this.isSelecting = false;
    this.selected = item;
    this.selectMessage = '';
    this.opts = Object.assign({}, DEFAULT_OPTS);
  }

  @action cancel() {
    this.isSelecting = false;
    this.selected = null;
    this.selectMessage = '';
    this.opts = Object.assign({}, DEFAULT_OPTS);
  }

  @action
  reset() {
    this.isSelecting = false;
    this.selected = void 0;
    this.selectMessage = '';
    this.opts = Object.assign({}, DEFAULT_OPTS);
  }

}

export default new BlockchainWalletSelectorStore();
