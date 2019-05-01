import wd from 'wd';
import sleep from '../../src/common/helpers/sleep';

export default async(driver) => {
  // should ask for permissions
  const permmision = await driver.waitForElementById('com.android.packageinstaller:id/permission_allow_button', wd.asserters.isDisplayed, 10000)

  // we accept
  permmision.click();
}