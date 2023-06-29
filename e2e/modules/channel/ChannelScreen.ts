import Gestures from '../../helpers/Gestures';
import { selectElement } from '../../helpers/Utils';
import AppScreen from '../common/AppScreen';

class ChannelScreen extends AppScreen {
  constructor() {
    super('ChannelScreen:FeedList');
  }

  get firstActivity() {
    return selectElement('id', 'ActivityView');
  }

  async openFirstPost() {
    const isDisplayed = await this.firstActivity.isDisplayed();
    if (!isDisplayed) {
      // @ts-ignore
      await Gestures.checkIfDisplayedWithSwipeUp(this.firstActivity, 20);
    }
    await this.firstActivity.click();
  }
}

export default new ChannelScreen();
