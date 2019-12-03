/**
 * Login action
 * @param {string} username
 * @param {string} password
 */
export default async function(username, password) {
  await element(by.id('usernameInput')).typeText(username);
  await element(by.id('userPasswordInput')).typeText(password);
  await element(by.id('loginButton')).tap();
}
