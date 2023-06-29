import { When } from '@cucumber/cucumber';
import ActivityScreen from './ActivityScreen';

When(/I boost the post/, async () => {
  await ActivityScreen.openBoost();
});
