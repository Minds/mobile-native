import { When } from '@cucumber/cucumber';
import ChannelScreen from './ChannelScreen';
import ActivityScreen from '../activity/ActivityScreen';

When(/I open the first post/, async () => {
  await ChannelScreen.openFirstPost();
  await ActivityScreen.waitForIsShown();
});
