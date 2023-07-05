import { selectElement } from '../../helpers/Utils';
import Gestures from '../../helpers/Gestures';
import AppScreen from '../common/AppScreen';

class LoginScreen extends AppScreen {
  constructor() {
    super('~Login-screen');
  }

  get usernameField() {
    return selectElement('id', 'usernameLoginInput');
  }

  get passwordField() {
    return selectElement('id', 'userPasswordInput');
  }

  get submitButton() {
    return selectElement('id', 'loginButton');
  }

  get incorrectCredentialsError() {
    return selectElement(
      'text',
      'Incorrect username/password. Please try again.',
      true,
    );
  }

  get emptyCredentialsError() {
    return selectElement('text', 'Required');
  }

  async submitLoginForm({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    await this.usernameField.waitForDisplayed();
    await this.usernameField.setValue(username);
    await this.passwordField.waitForDisplayed();
    await this.passwordField.setValue(password);

    // On smaller screens there could be a possibility that the button is not shown
    await Gestures.checkIfDisplayedWithSwipeUp(await this.submitButton, 2);
    await this.submitButton.click();
  }
}

export default new LoginScreen();
