import { Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
import WalletScreen from './WalletScreen';

When(/I switch to the cash option/, () => {
  return WalletScreen.cashTab.click();
});

When(/I switch to the Settings tab/, () => {
  return WalletScreen.cashSettings.click();
});

Then(/I should see the stripe connect button/, async () => {
  await WalletScreen.StripeConnectButton.waitForDisplayed({
    timeout: 10000,
  });
  const displayed = await WalletScreen.StripeConnectButton.isDisplayed();
  return assert.isTrue(displayed, 'Stripe connect button not found');
});
