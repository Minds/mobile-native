import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class MoreScreen extends AppScreen {
  constructor() {
    super('Drawer:wallet');
  }

  get wallet() {
    return selectElement('id', 'Drawer:wallet');
  }

  openWallet() {
    return this.wallet.click();
  }
}

export default new MoreScreen();
