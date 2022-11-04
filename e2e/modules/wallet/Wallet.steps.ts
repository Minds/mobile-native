import { Then, When } from '@cucumber/cucumber';
import WalletScreen from './WalletScreen';

When(/I switch to the cash option/, () => {
  return WalletScreen.cashTab.click();
});

When(/I switch to the Settings tab/, () => {
  return WalletScreen.cashSettings.click();
});

Then(/I should see the stripe connect button/, () => {
  return WalletScreen.StripeConnectButton.isDisplayed();
});
