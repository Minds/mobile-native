

import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver, amount) => {

  const lockButton = await driver.waitForElementByAccessibilityId('Post lock button', wd.asserters.isDisplayed, 5000);
  await lockButton.click();

  const postInput = await driver.waitForElementByAccessibilityId('Poster lock amount input', wd.asserters.isDisplayed, 5000);
  await postInput.type(amount);

  // we press post button
  const postButton = await driver.elementByAccessibilityId('Poster lock done button');
  await postButton.click();
}