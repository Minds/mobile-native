import login from "./login";

export default async function() {
  await waitFor(element(by.id('usernameInput'))).toBeVisible().withTimeout(5000);
  await login(process.env.loginUser, process.env.loginPass);
  await expect(element(by.id('NewsfeedScreen'))).toBeVisible();
  await element(by.id('captureFab')).tap();
}
