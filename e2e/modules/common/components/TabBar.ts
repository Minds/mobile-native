import { selectElement } from '../../../helpers/Utils';

class TabBar {
  get newsfeedTabIcon() {
    return selectElement('id', 'Menu tab button');
  }

  get moreTabIcon() {
    return selectElement('id', 'Messenger tab button');
  }

  async openMore() {
    await this.moreTabIcon.waitForDisplayed();
    await this.moreTabIcon.click();
  }
}

export default new TabBar();
