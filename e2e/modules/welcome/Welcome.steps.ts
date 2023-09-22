import { When } from '@cucumber/cucumber';
import LoginScreen from '../login/LoginScreen';
import WelcomeScreen from './WelcomeScreen';

When(/^I am on Login screen$/, async () => {
  await WelcomeScreen.loginButton.click();
  await LoginScreen.submitButton.waitForDisplayed();
});
