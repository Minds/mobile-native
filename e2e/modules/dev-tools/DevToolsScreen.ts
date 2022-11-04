import ActionHelper from '../../helpers/ActionHelper';
import Gestures from '../../helpers/Gestures';
import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class DevToolsScreen extends AppScreen {
  constructor() {
    super('DevToolsScreen');
  }

  async toggleFeature(feature: string) {
    const element = await selectElement('id', `${feature}:select`);
    await Gestures.checkIfDisplayedWithSwipeUp(element, 20);
    await element.click();
    const onOption = await selectElement('text', `On`);
    await onOption.waitForDisplayed();
    await onOption.click();
    return ActionHelper.restartApp();
  }
}

export default new DevToolsScreen();
