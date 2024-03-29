import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';
import SettingsScreen from '../settings/SettingsScreen';

class MoreScreen extends AppScreen {
  constructor() {
    super('Drawer:wallet');
  }

  get channel() {
    return selectElement('id', 'Drawer:channel');
  }

  get wallet() {
    return selectElement('id', 'Drawer:wallet');
  }

  get settings() {
    return selectElement('id', 'Drawer:settings');
  }

  openWallet() {
    return this.wallet.click();
  }

  openChannel() {
    return this.channel.click();
  }

  async openSettings() {
    await this.settings.click();
    return SettingsScreen.waitForIsShown();
  }
}

export default new MoreScreen();
