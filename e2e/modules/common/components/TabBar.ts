import { selectElement } from '../../../helpers/Utils';

class TabBar {
  get newsfeedTabIcon() {
    return selectElement('id', 'Tabs:Newsfeed');
  }

  get moreTabIcon() {
    return selectElement('id', 'Tabs:More');
  }

  async openMore() {
    await this.moreTabIcon.waitForDisplayed();
    await this.moreTabIcon.click();
  }
}

export default new TabBar();
