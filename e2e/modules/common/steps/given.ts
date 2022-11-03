import { Given } from '@cucumber/cucumber';
import { context } from '../../../data/Context';
import HomeScreen from '../../home/HomeScreen';
import LoginScreen from '../../login/LoginScreen';
import WelcomeScreen from '../../welcome/WelcomeScreen';
import { SCREENS } from '../navigator';

// common "Given" steps

Given(/^I'm logged in$/, async () => {
  await WelcomeScreen.loginButton.waitForDisplayed();
  await WelcomeScreen.loginButton.click();
  await LoginScreen.submitButton.waitForDisplayed();

  const targetChannel = context.logins['valid channel'];
  if (!targetChannel.username || !targetChannel.password) {
    throw new Error('channel not set');
  }
  await LoginScreen.submitLoginForm({
    username: targetChannel.username,
    password: targetChannel.password,
  });
  await HomeScreen.waitForIsShown();
});

Given(/^I navigate to the (.+) screen$/, async (screen: string) => {
  if (!SCREENS[screen]) {
    throw new Error(
      `The screen ${screen} is not supported. Supported screens are ${Object.keys(
        SCREENS,
      ).join(', ')}`,
    );
  }

  return SCREENS[screen]();
});
