import { useNavigation } from '@react-navigation/native';
import MIcon from '@expo/vector-icons/MaterialIcons';

import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
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
import ThemedStyles from '~/styles/ThemedStyles';
import { NavigationItemTypeEnum } from '~/graphql/api';
import openUrlService from '~/common/services/open-url.service';
import { useCustomNavigationMenu } from '~/modules/navigation/service/custom-navigation.service';
import mindsConfigService from '~/common/services/minds-config.service';
import PermissionsService from '~/common/services/permissions.service';

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
  const channel = sessionService.getUser();
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
      {
        name: i18n.t('discovery.groups'),
        icon: 'group',
        onPress: () => {
          navigation.navigate('GroupsList');
        },
      },
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
    };

    if (!customNavigation) {
      throw new Error('Custom navigation is not defined for this tenant');
    }

    const config = mindsConfigService.getSettings();

    list = customNavigation
      .filter(item =>
        item.id === 'boost' &&
        (!config?.tenant?.boost_enabled || !PermissionsService.canBoost())
          ? false
          : true,
      )
      .map(item => ({
        name: item.id === 'channel' ? `@${channel.name}` : item.name,
        icon: (
          <MIcon
            name={item.id === 'channel' ? 'person' : (item.iconId as any)}
            size={24}
            style={ThemedStyles.style.colorPrimaryText}
          />
        ),
        testID: `Drawer:${item.id}`,
        onPress:
          item.type === NavigationItemTypeEnum.Core
            ? navigationMap[item.id]
            : () => item.url && openUrlService.open(item.url),
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

  return list;
};
