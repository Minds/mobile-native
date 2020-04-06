import { waitForElement, waitForAndType, waitForAndTap } from "../helpers/waitFor";
import sleep from "../../src/common/helpers/sleep";

/**
 * Login action
 * @param {string} username
 * @param {string} password
 */
export default async function(username, password) {
  await waitForAndType(by.id('usernameInput'), username + "\n");
  await waitForAndType(by.id('userPasswordInput'), password + "\n");
  await waitForAndTap(by.id('loginButton'));
}
