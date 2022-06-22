require('dotenv').config();
import Page from './page';
import generateRandomId from '../helpers';

class RegistrationPage extends Page {
  /**
   * define elements
   */
  get validUser() {
    return generateRandomId();
  }
  get validPassword() {
    return process.env.PASSWORD;
  }
  get validEmail() {
    return 'wdiotestmds@gmail.com';
  }
  get joinNowButton() {
    return super.selectElement('id', 'Join Now');
  }
  get usernameField() {
    return super.selectElement('id', 'usernameInput');
  }
  get emailField() {
    return super.selectElement('id', 'emailInput');
  }
  get passwordField() {
    return super.selectElement('id', 'passwordInput');
  }
  get checkboxes() {
    return super.selectElement('id', 'checkbox');
  }
  get registerButton() {
    return super.selectElement('id', 'registerButton');
  }
  get invalidPassword() {
    return 'invalidPassword';
  }
  get invalidEmail() {
    return 'wdiotestmds@gmail';
  }
  get usernameInUse() {
    return process.env.USERNAME;
  }
  get emptyCredentialsError() {
    return super.selectElement('text', 'Required');
  }
  get invalidPasswordError() {
    return super.selectElement('text', 'Insecure Password');
  }
  get invalidEmailError() {
    return super.selectElement('text', 'Invalid email');
  }
  get duplicateUsernameError() {
    return super.selectElement('text', 'Username already taken');
  }
  get tosNotSelectedError() {
    return super.selectElement(
      'text',
      'You should accept the terms and conditions',
    );
  }
  /**
   * define or overwrite page methods
   */
  open(path) {
    super.open(path);
  }
}

export default new RegistrationPage();
