import { useNavigation } from '@react-navigation/native';
import MIcon from '@expo/vector-icons/MaterialIcons';

import {
  AFFILIATES_ENABLED,
  BOOSTS_ENABLED,
  GOOGLE_PLAY_STORE,
  IS_IOS,
  IS_TENANT,
  SUPERMIND_ENABLED,
  WALLET_ENABLED,
} from '~/config/Config';
import { IconNameType } from '~/common/ui/icons/map';

import { NavigationItemTypeEnum } from '~/graphql/api';
import { useCustomNavigationMenu } from '~/modules/navigation/service/custom-navigation.service';
import sp from '~/services/serviceProvider';
import useGetDownloadedList from '~/modules/audio-player/hooks/useGetDownloadedList';

type Flags = Record<'hasPro' | 'hasPlus', boolean>;

type MenuItem = {
  name: string;
  icon: IconNameType | JSX.Element;
  onPress: () => void;
  testID?: string;
} | null;

export const useDrawerList = ({ hasPro, hasPlus }: Flags) => {
  const navigation = useNavigation<any>();
  const customNavigation = useCustomNavigationMenu();
  const channel = sp.session.getUser();
  const i18n = sp.i18n;

  const { count: downloadedTracksCount } = useGetDownloadedList();

  let list: MenuItem[];
  if (!IS_TENANT) {
    list = [
      {
        name: i18n.t('settings.profile'),
        icon: 'profile',
        testID: 'Drawer:channel',
        onPress: () => {
          navigation.push('Channel', { entity: channel });
        },
      },
      !IS_IOS
        ? {
            name: i18n.t('wire.lock.plus'),
            icon: 'queue',
            onPress: () => {
              navigation.navigate('PlusDiscoveryScreen');
            },
          }
        : null,
      {
        name: i18n.t('discovery.filters.audio'),
        icon: 'headphones',
        testID: 'Drawer:audio',
        onPress: () => {
          navigation.push('DiscoverySearch', { t: 'audio', f: 'latest' });
        },
      },
      BOOSTS_ENABLED
        ? {
            name: i18n.t('settings.boostConsole'),
            icon: 'boost',
            onPress: () => {
              navigation.push('BoostConsole');
            },
          }
        : null,
      SUPERMIND_ENABLED
        ? {
            name: 'Supermind',
            icon: 'supermind',
            onPress: () => {
              navigation.navigate('SupermindConsole');
            },
          }
        : null,
      WALLET_ENABLED && !GOOGLE_PLAY_STORE
        ? {
            name: i18n.t('moreScreen.wallet'),
            icon: 'bank',
            testID: 'Drawer:wallet',
            onPress: () => {
              navigation.navigate('Wallet');
            },
          }
        : null,
      AFFILIATES_ENABLED
        ? {
            name: 'Affiliate',
            icon: 'affiliate',
            onPress: () => {
              navigation.navigate('AffiliateProgram');
            },
          }
        : null,
      !(hasPro && hasPlus)
        ? {
            name: i18n.t('moreScreen.upgrade'),
            icon: 'verified',
            testID: 'Drawer:upgrade',
            onPress: () => {
              navigation.navigate('UpgradeScreen', {
                onComplete: () => null,
                pro: hasPro,
              });
            },
          }
        : null,
      {
        name: i18n.t('moreScreen.settings'),
        icon: 'settings',
        testID: 'Drawer:settings',
        onPress: () => {
          navigation.navigate('Settings');
        },
      },
    ];
  } else {
    const navigationMap = {
      boost: () => {
        navigation.push('BoostConsole');
      },
      channel: () => {
        navigation.push('Channel', { entity: channel });
      },
      groups: () => {
        navigation.navigate('GroupsList');
      },
      settings: () => {
        navigation.navigate('Settings');
      },
      memberships: () => {
        navigation.navigate('TenantMemberships');
      },
    };

    if (!customNavigation) {
      throw new Error('Custom navigation is not defined for this tenant');
    }

    const config = sp.config.getSettings();

    list = customNavigation
      .filter(item =>
        item.id === 'boost' &&
        (!config?.tenant?.boost_enabled || !sp.permissions.canBoost())
          ? false
          : true,
      )
      .map(item => ({
        name: item.id === 'channel' ? `@${channel.name}` : item.name,
        icon: (
          <MIcon
            name={item.id === 'channel' ? 'person' : (item.iconId as any)}
            size={24}
            style={sp.styles.style.colorPrimaryText}
          />
        ),
        testID: `Drawer:${item.id}`,
        onPress:
          item.type === NavigationItemTypeEnum.Core
            ? navigationMap[item.id]
            : () => item.url && sp.resolve('openURL').open(item.url),
      }));

    list.push({
      name: i18n.t('moreScreen.settings'),
      icon: 'settings',
      testID: 'Drawer:settings',
      onPress: () => {
        navigation.navigate('Settings');
      },
    });
  }

  if (downloadedTracksCount > 0) {
    list.push({
      name: i18n.t('moreScreen.downloadedAudio'),
      icon: 'offline-pin',
      onPress: () => {
        navigation.navigate('DownloadedAudioScreen');
      },
    });
  }

  return list;
};
