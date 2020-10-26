//@ts-nocheck
import { observable, action, observe } from 'mobx';

import NavigationService from '../../navigation/NavigationService';

let dispose;

const DEFAULT_OPTS = {
  signable: false,
  offchain: false,
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

    NavigationService.push('BlockchainWalletModal');

    return await new Promise((resolve, reject) => {
      if (dispose) {
        dispose();
        dispose = void 0;
      }

      dispose = observe(
        this,
        'selected',
        action((change) => {
          if (change.newValue === null) {
            reject(new Error('E_CANCELED'));
            return;
          }
          if (typeof change.newValue !== 'undefined') {
            dispose();
            dispose = void 0;

            this.isSelecting = false;
            this.selected = void 0;
            this.selectMessage = '';
            this.opts = Object.assign({}, DEFAULT_OPTS);

            resolve(change.newValue);

            NavigationService.goBack();
          }
        }),
      );
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

export default BlockchainWalletSelectorStore;
