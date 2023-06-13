import Gestures from '../../helpers/Gestures';
import { selectElement } from '../../helpers/Utils';
import ActivityScreen from '../activity/ActivityScreen';
import AppScreen from '../common/AppScreen';

class ChannelScreen extends AppScreen {
  constructor() {
    super('ChannelScreen:FeedList');
  }

  get firstActivity() {
    return selectElement('id', 'ActivityView');
  }

  async openFirstPost() {
    const firstPost = await this.firstActivity;
    await Gestures.checkIfDisplayedWithSwipeUp(firstPost, 20);
    await firstPost.click();
    await ActivityScreen.waitForIsShown();
  }
}

export default new ChannelScreen();
