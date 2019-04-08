export const login = async(driver) => {
  const username = await driver.elementByAccessibilityId('username input');
  const password = await driver.elementByAccessibilityId('password input');
  const loginButton = await driver.elementByAccessibilityId('login button');

  await username.type(process.env.loginUser);
  await password.type(process.env.loginPass);
  await loginButton.click();
}