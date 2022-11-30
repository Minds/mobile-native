import { selectElement } from '../../helpers/Utils';
import BoostScreen from '../boost/BoostScreen';
import AppScreen from '../common/AppScreen';

class ActivityScreen extends AppScreen {
  constructor() {
    super('ActivityScreen');
  }

  get boostButton() {
    return selectElement('id', 'Boost');
  }

  async openBoost() {
    await this.boostButton.waitForDisplayed();
    await this.boostButton.click();
    return BoostScreen.waitForIsShown();
  }
}

export default new ActivityScreen();
