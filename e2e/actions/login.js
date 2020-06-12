import { waitForAndType, waitForAndTap, waitForElement } from '../helpers/waitFor';

/**
 * Login action
 * @param {string} username
 * @param {string} password
 */
export default async function (username, password) {
  await waitForAndType(by.id('usernameInput'), username);
  await waitForAndType(by.id('userPasswordInput'), password);
  await waitForAndTap(by.id('loginButton'));
}
