import { Given } from '@cucumber/cucumber';
import { context } from '../../../data/Context';
import DevToolsScreen from '../../dev-tools/DevToolsScreen';
import HomeScreen from '../../home/HomeScreen';
import LoginScreen from '../../login/LoginScreen';
import MoreScreen from '../../more/MoreScreen';
import SettingsScreen from '../../settings/SettingsScreen';
import WelcomeScreen from '../../welcome/WelcomeScreen';
import { SCREENS } from '../screens';
import TabBar from './../components/TabBar';

// common "Given" steps

Given(/^I am logged in$/, async () => {
  await WelcomeScreen.loginButton.waitForDisplayed();
  await WelcomeScreen.loginButton.click();
  await LoginScreen.submitButton.waitForDisplayed();

  const targetChannel = context.logins['valid'];
  if (!targetChannel.username || !targetChannel.password) {
    throw new Error('channel not set');
  }
  await LoginScreen.submitLoginForm({
    username: targetChannel.username,
    password: targetChannel.password,
  });
  return HomeScreen.waitForIsShown();
});

Given(/^I am logged out$/, async () => {
  await WelcomeScreen.loginButton.waitForDisplayed();
});

Given(/^I navigate to (.+) screen$/, async (screen: string) => {
  if (!SCREENS[screen]) {
    throw new Error(
      `The screen ${screen} is not supported. Supported screens are ${Object.keys(
        SCREENS,
      ).join(', ')}`,
    );
  }

  return SCREENS[screen]();
});

Given(/the (.+) feature is active/, async (feature: string) => {
  if (!HomeScreen.isDisplayed()) {
    throw new Error(
      'User must be logged in and in the home page to change experiments',
    );
  }

  await TabBar.openMore();
  await MoreScreen.openSettings();
  await SettingsScreen.openDevTools();
  return DevToolsScreen.toggleFeature(feature);
});
