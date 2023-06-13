import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class BoostScreen extends AppScreen {
  constructor() {
    super('BoostScreen');
  }

  get expandReach() {
    return selectElement('text', 'Expand reach');
  }

  get nextBtn() {
    return selectElement('text', 'Next');
  }

  get tokenTab() {
    return selectElement('text', 'Token');
  }

  get cashTab() {
    return selectElement('text', 'Cash');
  }

  get boostPost() {
    return selectElement('text', 'Boost Post');
  }
}

export default new BoostScreen();
