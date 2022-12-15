import { When } from '@cucumber/cucumber';
import ActionHelper from '../../helpers/ActionHelper';
import ActivityScreen from '../activity/ActivityScreen';
import ChannelScreen from './ChannelScreen';

When(/I open the first post/, async () => {
  await ChannelScreen.openFirstPost();
  await ActivityScreen.waitForIsShown();
  await ActivityScreen.openBoost();
  await ActionHelper.pause(20);
});
