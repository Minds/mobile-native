import MoreScreen from '../more/MoreScreen';
import TabBar from './components/TabBar';

const SCREENS: { [k: string]: () => Promise<boolean | void> } = {
  Home: async () => {
    await TabBar.newsfeedTabIcon.waitForDisplayed();
    return TabBar.newsfeedTabIcon.isDisplayed();
  },
  Wallet: async () => {
    await TabBar.openMore();
    await MoreScreen.openWallet();
  },
};

export { SCREENS };
