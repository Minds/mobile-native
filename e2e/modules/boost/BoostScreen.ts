import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class BoostScreen extends AppScreen {
  constructor() {
    super('BoostScreen');
  }

  get expandReach() {
    return selectElement('text', 'Expand reach', true);
  }

  get nextBtn() {
    return selectElement('text', 'Next');
  }

  get customizeAudience() {
    return selectElement('text', 'Customize your audience', true);
  }

  get cashTab() {
    return selectElement('text', 'Cash');
  }

  get boostPost() {
    return selectElement('text', 'Boost Post');
  }
}

export default new BoostScreen();
