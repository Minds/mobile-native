import { selectElement } from '../../../helpers/Utils';

class TabBar {
  get newsfeedTabIcon() {
    return selectElement('id', 'Menu tab button');
  }

  static async openHome() {
    await $('~Home').click();
  }

  static async openWebView() {
    await $('~Webview').click();
  }

  static async openLogin() {
    await $('~Login').click();
  }

  static async openForms() {
    await $('~Forms').click();
  }

  static async openSwipe() {
    await $('~Swipe').click();
  }

  static async openDrag() {
    await $('~Drag').click();
  }

  static async waitForTabBarShown(): Promise<boolean | void> {
    return $('~Home').waitForDisplayed({
      timeout: 20000,
    });
  }
}

export default new TabBar();
