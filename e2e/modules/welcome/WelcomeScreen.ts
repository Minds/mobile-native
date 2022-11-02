import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class WelcomeScreen extends AppScreen {
  constructor() {
    super('~Welcome-screen');
  }

  get loginButton() {
    return selectElement('text', 'Login');
  }

  get registerButton() {
    return selectElement('id', 'registerButton');
  }
}

export default new WelcomeScreen();
