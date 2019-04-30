import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver, text, image = false, permissions = true) => {
  // tap the post button
  const button = await driver.waitForElementByAccessibilityId('CaptureButton', wd.asserters.isDisplayed, 10000);
  button.click();

  if (permissions) {
    // should ask for permissions
    const permmision = await driver.waitForElementById('com.android.packageinstaller:id/permission_allow_button', wd.asserters.isDisplayed, 10000)

    // we accept
    permmision.click();
  }

  if (image) {
    // select first image
    const firstImage = await driver.waitForElementByAccessibilityId('Gallery Image 0', wd.asserters.isDisplayed, 5000);
    await firstImage.click();

    await sleep(3000);
  }

  // post screen must be shown
  const postInput = await driver.waitForElementByAccessibilityId('PostInput', wd.asserters.isDisplayed, image ? 15000 : 5000);
  await postInput.type(text);

  // we press post button
  const postButton = await driver.elementByAccessibilityId('Capture Post Button');
  postButton.click();
}