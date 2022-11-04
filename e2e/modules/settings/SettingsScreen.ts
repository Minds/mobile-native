import Gestures from '../../helpers/Gestures';
import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';
import DevToolsScreen from '../dev-tools/DevToolsScreen';

class SettingsScreen extends AppScreen {
  constructor() {
    super('SettingsScreen');
  }

  get title() {
    return selectElement('text', 'Settings');
  }

  get devTools() {
    return selectElement('id', 'SettingsScreen:DevTools');
  }

  async openDevTools() {
    for (let i = 0; i < 16; i++) {
      await this.title.click();
    }
    await Gestures.checkIfDisplayedWithSwipeUp(await this.devTools, 2);
    await this.devTools.click();
    return DevToolsScreen.waitForIsShown();
  }
}

export default new SettingsScreen();
