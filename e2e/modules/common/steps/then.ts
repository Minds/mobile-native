import { Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import TabBar from '../components/TabBar';

// common "Then" steps

const SCREENS: { [k: string]: () => Promise<boolean> } = {
  Home: async () => {
    await TabBar.newsfeedTabIcon.waitForDisplayed();
    return TabBar.newsfeedTabIcon.isDisplayed();
  },
};

Then(/^I will be navigated to the (.+) screen$/, async (screen: string) => {
  if (!SCREENS[screen]) {
    throw new Error(
      `The screen ${screen} is not supported. Supported screens are ${Object.keys(
        SCREENS,
      ).join(', ')}`,
    );
  }

  const isDisplayed = await SCREENS[screen]();
  assert.isTrue(isDisplayed);
});
