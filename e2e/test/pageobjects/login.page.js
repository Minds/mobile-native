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
