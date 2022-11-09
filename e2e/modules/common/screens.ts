import MoreScreen from '../more/MoreScreen';
import TabBar from './components/TabBar';

const SCREENS: { [k: string]: () => Promise<boolean | void> } = {
  Wallet: async () => {
    await TabBar.openMore();
    await MoreScreen.openWallet();
  },
};

export { SCREENS };
