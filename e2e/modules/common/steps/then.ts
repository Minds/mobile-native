import { Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import TabBar from '../components/TabBar';
import { selectElement } from '../../../helpers/Utils';
import ActionHelper from '../../../helpers/ActionHelper';

// common "Then" steps

const SCREENS: { [k: string]: () => Promise<boolean> } = {
  Home: async () => {
    await TabBar.newsfeedTabIcon.waitForDisplayed();
    return TabBar.newsfeedTabIcon.isDisplayed();
  },
};

Then(/^I am taken to (.+) screen$/, async (screen: string) => {
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

/**
 * Checks whether a text is shown.
 * supports using environment variables when the text starts with $
 */
Then(/I can see (.+)/, async (text: string) => {
  const isEnv = text.slice(0, 1) === '$';
  const el = await selectElement(
    'text',
    isEnv ? process.env[text.slice(1)] ?? '' : text,
    true,
  );
  await el.waitForDisplayed();
  const displayed = await el.isDisplayed();
  assert.isTrue(displayed);
});
