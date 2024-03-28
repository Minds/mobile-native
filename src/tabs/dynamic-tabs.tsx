import NewsfeedStack from '~/navigation/NewsfeedStack';
import tabs from './tabs.json';
import DiscoveryStack from '~/navigation/DiscoveryStack';
import NotificationsStack from '~/navigation/NotificationsStack';
import ChannelScreen from '~/channel/v2/ChannelScreen';
import sessionService from '~/common/services/session.service';
import { IS_TENANT } from '~/config/Config';
import { BoostConsoleScreen } from '~/modules/boost';
import PlusDiscoveryScreen from '~/discovery/v2/PlusDiscoveryScreen';
import SupermindConsoleScreen from '~/supermind/SupermindConsoleScreen';
import WalletScreen from '~/wallet/v3/WalletScreen';
import AffiliateProgramScreen from '~/modules/affiliate/screens/AffiliateProgramScreen';
import MoreStack from '~/navigation/MoreStack';
import GroupStack from '~/navigation/GroupStack';
import { IconMapNameType } from '~/common/ui/icons/map';

const orderedMerge = (source: typeof screens, dest: any[]) =>
  source
    .map(a => {
      const object = dest.find(d => d.name === a.name);
      return { ...a, ...object };
    })
    .sort((a, b) => a.order - b.order);

const screens = [
  {
    name: 'Newsfeed',
    component: NewsfeedStack,
    options: { lazy: false, tabBarTestID: 'Tabs:Newsfeed' },
  },
  {
    name: 'Explore',
    component: DiscoveryStack,
    options: { lazy: false, tabBarTestID: 'Discovery tab button' },
  },
  {
    name: 'Notifications',
    component: NotificationsStack,
    options: { tabBarTestID: 'Notifications tab button' },
  },
  {
    name: 'Profile',
    component: ChannelScreen,
    initialParams: { entity: sessionService.getUser() },
  },
  {
    name: 'Boosts',
    component: BoostConsoleScreen,
    hideCondition: IS_TENANT,
  },
  {
    name: 'MindsPlus',
    component: PlusDiscoveryScreen,
    options: { tabBarTestID: 'Tabs:MindsPlus' },
    hideCondition: IS_TENANT,
  },
  {
    name: 'Supermind',
    component: SupermindConsoleScreen,
    hideCondition: IS_TENANT,
  },
  {
    name: 'Wallet',
    component: WalletScreen,
    hideCondition: IS_TENANT,
  },
  {
    name: 'AffiliateProgram',
    component: AffiliateProgramScreen,
    options: { drawerLabel: 'Affiliate Program' },
    hideCondition: IS_TENANT,
  },
  {
    name: 'Groups',
    component: GroupStack,
  },
  {
    name: 'Settings',
    component: MoreStack,
  },
];

export const getScreens = () =>
  orderedMerge(screens, tabs).filter(s => !s.hideCondition);

export const getIconName = (routeName: string) =>
  (getScreens().find(s => s.name === routeName)?.icon ??
    'menu') as IconMapNameType;
