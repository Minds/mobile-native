import React from 'react';

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import FitScrollView from '../common/components/FitScrollView';

import {
  H2,
  H3,
  B1,
  Row,
  Column,
  HairlineSpacer,
  IconButton,
  Icon,
  Avatar,
  Screen,
  PressableLine,
  Spacer,
} from '~ui';
import { Icon as IconV2 } from '@minds/ui';
import {
  hasVariation,
  useIsGoogleFeatureOn,
  useIsIOSFeatureOn,
} from 'ExperimentsProvider';
import { IconMapNameType, IconNameType } from '~/common/ui/icons/map';
import { navigateToHelp } from '../settings/SettingsScreen';
import {
  AFFILIATES_ENABLED,
  BOOSTS_ENABLED,
  IS_TENANT,
  SUPERMIND_ENABLED,
  WALLET_ENABLED,
} from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import { PRO_PLUS_SUBSCRIPTION_ENABLED } from '~/config/Config';

const getOptionsSmallList = navigation => {
  return [
    !IS_TENANT
      ? {
          name: i18n.t('earnScreen.title'),
          onPress: () => {
            navigation.navigate('EarnModal');
          },
        }
      : null,
    !IS_TENANT
      ? {
          name: i18n.t('analytics.title'),
          onPress: () => {
            navigation.navigate('Analytics');
          },
        }
      : null,
    {
      name: i18n.t('help'),
      onPress: navigateToHelp,
    },
  ];
};

type Flags = Record<'isIosMindsHidden' | 'hideTokens', boolean>;

type MenuItem = {
  name: string;
  icon: IconNameType | JSX.Element;
  onPress: () => void;
  testID?: string;
} | null;
const getOptionsList = (
  navigation,
  { isIosMindsHidden, hideTokens }: Flags,
) => {
  const channel = sessionService.getUser();
  const list: MenuItem[] = [
    {
      name: i18n.t('settings.profile'),
      icon: 'profile',
      testID: 'Drawer:channel',
      onPress: () => {
        navigation.push('Channel', { entity: channel });
      },
    },
    !isIosMindsHidden && !IS_TENANT
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
    WALLET_ENABLED && !hideTokens
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
    PRO_PLUS_SUBSCRIPTION_ENABLED
      ? {
          name: i18n.t('moreScreen.upgrade'),
          icon: (
            <IconV2
              name="verified"
              color={ThemedStyles.getColor('PrimaryText')}
            />
          ),
          testID: 'Drawer:upgrade',
          onPress: () => {
            navigation.navigate('UpgradeOptionsScreen', {
              onComplete: () => null,
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
    hasVariation('mob-4472-in-app-verification')
      ? {
          name: 'Verify account',
          icon: 'group',
          onPress: async () => {
            navigation.navigate('InAppVerification');
          },
        }
      : null,
  ];

  return list;
};

/**
 * Drawer menu
 * @param props
 */
export default function Drawer(props) {
  const channel = sessionService.getUser();
  const isIosMindsHidden = useIsIOSFeatureOn(
    'mob-4637-ios-hide-minds-superminds',
  );
  const hideTokens = useIsGoogleFeatureOn('mob-5221-google-hide-tokens');

  const handleChannelNav = () => {
    props.navigation.push('Channel', { entity: channel });
  };

  const handleMultiUserNav = () => props.navigation.navigate('MultiUserScreen');

  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const optionsList = getOptionsList(props.navigation, {
    isIosMindsHidden,
    hideTokens,
  });
  const optionsSmallList = getOptionsSmallList(props.navigation);
  return (
    <Screen safe>
      <FitScrollView>
        <HairlineSpacer top="XXL">
          <DrawerHeader
            avatar={avatar}
            username={channel.username}
            name={channel.name}
            onIconPress={handleMultiUserNav}
            onUserPress={handleChannelNav}
          />
        </HairlineSpacer>
        <Spacer vertical="M">
          <DrawerList list={optionsList} small={false} />
        </Spacer>
        <HairlineSpacer />
        <Spacer vertical="M">
          <DrawerList list={optionsSmallList} small />
        </Spacer>
      </FitScrollView>
    </Screen>
  );
}

const DrawerList = ({ list, small }) => {
  return list.map((l, i) =>
    !l ? null : (
      <DrawerNavItem
        small={small}
        key={'list' + i}
        name={l.name}
        icon={l.icon}
        onPress={l.onPress}
        testID={l.testID}
      />
    ),
  );
};

const DrawerHeader = ({ name, username, avatar, onUserPress, onIconPress }) => {
  return (
    <Row left="XL" right="XL" bottom="XXL">
      <Avatar source={avatar} size="medium" onPress={onUserPress} />
      <Column flex align="centerStart" right="M" left="S">
        <H2 onPress={onUserPress} numberOfLines={1} flat>
          {name || `@${username}`}
        </H2>
        {name && (
          <B1 flat onPress={onUserPress} testID="channelUsername">
            @{username}
          </B1>
        )}
      </Column>
      <IconButton
        scale
        color="SecondaryText"
        name="account-multi"
        testID="multiUserIcon"
        onPress={onIconPress}
      />
    </Row>
  );
};

type DrawerNavItemProps = {
  name: string;
  icon?: IconMapNameType | JSX.Element;
  onPress: () => void;
  small?: boolean;
  testID?: string;
};
const DrawerNavItem = ({
  icon,
  name,
  onPress,
  small,
  testID,
}: DrawerNavItemProps) => {
  const T = small ? B1 : H3;
  return (
    <PressableLine testID={testID} onPress={onPress}>
      <Row align="centerStart" flex left="XXL" vertical={small ? 'M' : 'L'}>
        {typeof icon === 'string' ? (
          <Icon name={icon} size={24} color="PrimaryText" />
        ) : (
          icon
        )}
        <T left={icon ? 'L' : undefined} font={small ? 'regular' : 'bold'}>
          {name}
        </T>
      </Row>
    </PressableLine>
  );
};
