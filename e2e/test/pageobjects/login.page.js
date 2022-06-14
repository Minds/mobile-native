require('dotenv').config();
import Page from './page';

class LoginPage extends Page {
  /**
   * define elements
   */
  get validUser() {
    return process.env.USERNAME;
  }
  get validPassword() {
    return process.env.PASSWORD;
  }
  get incorrectUser() {
    return 'invalidUser';
  }
  get incorrectPassword() {
    return 'invalidPassword';
  }
  get bannedUser() {
    return 'test_banned_user';
  }
  get bannedPassword() {
    return 'Minds@12345';
  }
  get deletedUser() {
    return 'test_deleted_user';
  }
  get deletedPassword() {
    return 'Minds@12345';
  }
  get emptyCredentialsError() {
    return super.selectElement('text', 'Required');
  }
  get incorrectCredentialsError() {
    return super.selectElement(
      'text',
      'Incorrect username/password. Please try again.',
    );
  }
  /**
   * define or overwrite page methods
   */
  open(path) {
    super.open(path);
  }

  async login(username, password) {
    await super.login(username, password);
  }
}

export default new LoginPage();
