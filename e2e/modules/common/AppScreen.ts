import { selectElement } from '../../helpers/Utils';

export default class AppScreen {
  private selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  /**
   * Wait for the screen to be visible
   */
  async waitForIsShown(): Promise<boolean | void> {
    return selectElement('id', this.selector).waitForDisplayed();
  }

  async isDisplayed(): Promise<boolean | void> {
    return selectElement('id', this.selector).isDisplayed();
  }
}
