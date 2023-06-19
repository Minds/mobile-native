import { When, Then } from '@cucumber/cucumber';
import BoostScreen from './BoostScreen';

When(/I do a simple boost without actually submitting/, async () => {
  await BoostScreen.nextBtn.click();
  await BoostScreen.customizeAudience.waitForDisplayed();
  await BoostScreen.nextBtn.click();
  await BoostScreen.nextBtn.click();
});

Then(/^the boost should be posted successfully$/, async () => {
  //
});
