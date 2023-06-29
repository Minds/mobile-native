import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class ActivityScreen extends AppScreen {
  constructor() {
    super('ActivityScreen');
  }

  get boostButton() {
    return selectElement('id', 'Boost');
  }

  async openBoost() {
    if (!(await this.boostButton.isDisplayed())) {
      await this.boostButton.waitForDisplayed();
    }
    await this.boostButton.click();
  }
}

export default new ActivityScreen();
