import {
  observable,
  action,
  observe
} from 'mobx'

import { NavigationActions } from 'react-navigation';

import NavigationStoreService from '../../common/services/navigation.service';

let dispose;

/**
 * Blockchain Store
 */
class BlockchainWalletSelectorStore {
  @observable isSelecting = false;
  @observable selected = void 0;
  @observable selectMessage = '';
  @observable signableOnly = false;

  @action async waitForSelect(message = '', signableOnly = false) {
    if (this.isSelecting) {
      throw new Error('E_ALREADY_SELECTING');
    }

    this.selected = void 0;
    this.selectMessage = message;
    this.signableOnly = signableOnly;
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
          this.signableOnly = false;

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
    this.signableOnly = false;
  }

  @action cancel() {
    this.isSelecting = false;
    this.selected = null;
    this.selectMessage = '';
    this.signableOnly = false;
  }
}

export default new BlockchainWalletSelectorStore();
