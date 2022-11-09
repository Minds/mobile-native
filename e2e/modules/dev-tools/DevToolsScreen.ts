import ActionHelper from '../../helpers/ActionHelper';
import Gestures from '../../helpers/Gestures';
import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';
import TabBar from '../common/components/TabBar';
import HomeScreen from '../home/HomeScreen';

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
    // TODO: we should restart here but the devtools has an issue with keeping the state after restart
    await ActionHelper.goBack();
    await TabBar.openMore();
    return HomeScreen.isDisplayed();
  }
}

export default new DevToolsScreen();
