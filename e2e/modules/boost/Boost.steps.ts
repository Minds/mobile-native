import { When, Then } from '@cucumber/cucumber';
import ActionHelper from '../../helpers/ActionHelper';
import BoostScreen from './BoostScreen';

When(/I do a simple boost without actually submitting/, async () => {
  await BoostScreen.expandReach.click();
  await BoostScreen.nextBtn.click();
  await BoostScreen.nextBtn.click();
  await BoostScreen.tokenTab.click();
  await BoostScreen.nextBtn.click();
  // await ActionHelper.pause(20);
});

Then(/^the boost should be posted successfully$/, async () => {
  //
});
