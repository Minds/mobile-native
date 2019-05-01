import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver, text) => {
  // post screen must be shown
  const postInput = await driver.waitForElementByAccessibilityId('PostInput', wd.asserters.isDisplayed, 5000);
  await postInput.type(text);

  // we press post button
  const postButton = await driver.elementByAccessibilityId('Capture Post Button');
  postButton.click();
}