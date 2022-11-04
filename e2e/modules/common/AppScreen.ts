import { selectElement } from '../../helpers/Utils';

export default class AppScreen {
  private selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  /**
   * Wait for the login screen to be visible
   *
   * @param {boolean} isShown
   */
  async waitForIsShown(isShown = true): Promise<boolean | void> {
    return selectElement('id', this.selector).waitForDisplayed({
      reverse: !isShown,
    });
  }

  async isDisplayed(): Promise<boolean | void> {
    return selectElement('id', this.selector).isDisplayed();
  }
}
