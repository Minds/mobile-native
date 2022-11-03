import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class WalletScreen extends AppScreen {
  constructor() {
    super('WalletScreen:cash');
  }

  get cashTab() {
    return selectElement('id', 'WalletScreen:cash');
  }

  get cashSettings() {
    return selectElement('id', 'UsdTab:settings');
  }
}

export default new WalletScreen();
