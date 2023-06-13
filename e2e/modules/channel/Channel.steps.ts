import { When } from '@cucumber/cucumber';
import ChannelScreen from './ChannelScreen';

When(/I open the first post/, async () => {
  await ChannelScreen.openFirstPost();
});
