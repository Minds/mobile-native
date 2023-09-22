import MoreScreen from '../more/MoreScreen';
import TabBar from './components/TabBar';

const SCREENS: { [k: string]: () => Promise<boolean | void> } = {
  Wallet: async () => {
    await TabBar.openMore();
    return MoreScreen.openWallet();
  },
  'My Channel': async () => {
    await TabBar.openMore();
    return MoreScreen.openChannel();
  },
  'Switch Account': async () => {
    await TabBar.openMore();
    return MoreScreen.openSwitchAccount();
  },
  Drawer: async () => {
    return TabBar.openMore();
  },
};

export { SCREENS };
