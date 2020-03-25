import {
  observable,
  action,
  observe
} from 'mobx';

import NavigationService from '../../navigation/NavigationService';

let dispose;

export default class ModalControllerStore {
  route = '';
  defaultOpts = {};

  @observable isActive = false;
  @observable payload = void 0;
  @observable opts = {};

  @action async show(opts = {}) {
    if (this.isActive) {
      throw new Error('E_ALREADY_ACTIVE');
    } else if (!this.route) {
      throw new Error('E_EMPTY_ROUTE');
    }

    opts = Object.assign({}, this.defaultOpts, opts);

    this.payload = void 0;
    this.opts = opts;
    this.isActive = true;

    NavigationService.navigate(this.route);

    return await new Promise(resolve => {
      if (dispose) {
        dispose();
        dispose = void 0;
      }

      dispose = observe(this, 'payload', action(change => {
        if (typeof change.newValue !== 'undefined') {
          dispose();
          dispose = void 0;

          this.reset();
          this.payload = void 0;

          resolve(change.newValue);

          if (change.newValue !== null) {
            NavigationService.goBack();
          }
        }
      }));
    });
  }

  @action reset() {
    this.isActive = false;
    this.opts = Object.assign({}, this.defaultOpts);
  }

  @action submit(payload) {
    this.reset();
    this.payload = payload;
  }

  @action cancel(goBack = true) {
    this.reset();
    this.payload = null;

    if (goBack) {
      NavigationService.goBack();
    }
  }
}
