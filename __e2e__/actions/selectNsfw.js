import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver, options) => {
  // tap the toggle button
  const button = await driver.waitForElementByAccessibilityId('NSFW button', wd.asserters.isDisplayed, 5000);
  await button.click();

  // wait until the menu is shown
  await sleep(500);

  for (let index = 0; index < options.length; index++) {
    const name = options[index];
    const element = await driver.elementByAccessibilityId(`NSFW ${name}`);
    await element.click();
  }

  let action = new wd.TouchAction(driver);
  action.tap({x:100, y:170});
  await action.release().perform();
}