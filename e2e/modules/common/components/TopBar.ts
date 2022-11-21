import { selectElement } from '../../../helpers/Utils';
import ChannelScreen from '../../channel/ChannelScreen';

class TopBar {
  get avatar() {
    return selectElement('id', 'Topbar:Avatar');
  }

  async openChannel() {
    await this.avatar.waitForDisplayed();
    await this.avatar.click();
    return ChannelScreen.waitForIsShown();
  }
}

export default new TopBar();
