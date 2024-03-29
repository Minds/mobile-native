import { Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
import { context } from '../../data/Context';
import LoginScreen from './LoginScreen';
import ActionHelper from '../../helpers/ActionHelper';

When(
  /^I try to log in with credentials; username: '(.+)' and password: '(.+)'$/,
  async (username, password) => {
    await LoginScreen.submitLoginForm({
      username,
      password,
    });
  },
);

When(/^I try to log in with an? (.+)$/, async (channelType: any) => {
  if (!(channelType in context.logins)) {
    throw new Error(
      `Channel type ${channelType} is not supported. Supported types are ${Object.keys(
        context.logins,
      ).join(', ')}`,
    );
  }

  // @ts-ignore
  const targetChannel = context.logins[channelType];
  await LoginScreen.submitLoginForm({
    username: targetChannel.username,
    password: targetChannel.password,
  });
});

Then(/^I see an error that the inputs are required$/, async () => {
  await LoginScreen.emptyCredentialsError.waitForDisplayed({
    timeout: 2000,
  });
  const emptyCredentialsErrorDisplayed =
    await LoginScreen.emptyCredentialsError.isDisplayed();
  assert.isTrue(emptyCredentialsErrorDisplayed);
});

Then(/^I see an error that the credentials are invalid$/, async () => {
  await LoginScreen.incorrectCredentialsError.waitForDisplayed({
    timeout: 2000,
  });
  const incorrectCredentialsErrorDisplayed =
    await LoginScreen.incorrectCredentialsError.isDisplayed();
  assert.isTrue(incorrectCredentialsErrorDisplayed);
});
