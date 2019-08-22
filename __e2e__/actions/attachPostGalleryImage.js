import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver) => {
  // select first image
  const firstImage = await driver.waitForElementByAccessibilityId('Gallery image/jpeg', wd.asserters.isDisplayed, 5000);
  await firstImage.click();

  await sleep(3000);
}