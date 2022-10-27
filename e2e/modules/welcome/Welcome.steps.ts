import { Given, When } from '@cucumber/cucumber';
import LoginScreen from '../login/LoginScreen';
import WelcomeScreen from './WelcomeScreen';

Given(/^I'm logged out$/, async () => {
  await WelcomeScreen.loginButton.waitForDisplayed();
});

When(/^I tap on the login button$/, async () => {
  await WelcomeScreen.loginButton.click();
  await LoginScreen.submitButton.waitForDisplayed();
});
