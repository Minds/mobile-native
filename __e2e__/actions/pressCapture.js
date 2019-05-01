import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver) => {
  // tap the capture button
  const button = await driver.waitForElementByAccessibilityId('CaptureButton', wd.asserters.isDisplayed, 10000);
  button.click();
  return button;
}