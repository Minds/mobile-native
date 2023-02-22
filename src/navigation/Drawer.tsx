import React from 'react';
import { NavigationProp } from '@react-navigation/native';

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
  Avatar,
  Screen,
  PressableLine,
  Spacer,
} from '~ui';
// import FadeFrom from '~/common/components/animations/FadeFrom';
import apiService, { isNetworkError } from '~/common/services/api.service';
import { showNotification } from 'AppMessages';
import { useIsFeatureOn, useIsIOSFeatureOn } from 'ExperimentsProvider';
import { MoreStackParamList } from './NavigationTypes';

type Navigation = NavigationProp<MoreStackParamList, 'Drawer'>;

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
const navigateToHelp = async (navigation: Navigation) => {
  try {
    const response = await apiService.get<any>('api/v3/helpdesk/zendesk', {
      returnUrl: 'true',
    });
    if (response && response.url) {
      navigation.navigate('WebView', {
        url: unescape(response.url),
      });
    }
  } catch (err) {
    console.log(err);
    if (isNetworkError(err)) {
      showNotification(i18n.t('errorMessage'), 'warning');
    } else {
      showNotification(i18n.t('cantReachServer'), 'warning');
    }
  }
};

const getOptionsSmallList = navigation => {
  return [
    {
      name: i18n.t('help'),
      onPress: () => {
        navigateToHelp(navigation);
      },
    },
    {
      name: i18n.t('earnScreen.title'),
      onPress: () => {
        navigation.navigate('EarnModal');
      },
    },
    {
      name: i18n.t('referrals.menu'),
      onPress: () => {
        navigation.navigate('Referrals');
      },
    },
  ];
};

type Flags = Record<'isIosMindsHidden' | 'isVerificationEnabled', boolean>;

const getOptionsList = (navigation, { isIosMindsHidden }: Flags) => {
  const channel = sessionService.getUser();
  let list = [
    {
      name: i18n.t('settings.profile'),
      icon: 'user',
      testID: 'Drawer:channel',
      onPress: () => {
        navigation.push('Channel', { entity: channel });
      },
    },
    !isIosMindsHidden
      ? {
          name: i18n.t('wire.lock.plus'),
          icon: 'queue',
          onPress: () => {
            navigation.navigate('PlusDiscoveryScreen');
          },
        }
      : null,
    {
      name: 'Supermind',
      onPress: () => {
        navigation.navigate('SupermindConsole');
      },
    },
    {
      name: i18n.t('moreScreen.wallet'),
      icon: 'bank',
      testID: 'Drawer:wallet',
      onPress: () => {
        navigation.navigate('Wallet');
      },
    },
  ];
  list = [
    ...list,
    {
      name: 'Analytics',
      icon: 'analytics',

      onPress: () => {
        navigation.navigate('Analytics');
      },
    },
    {
      name: i18n.t('discovery.groups'),
      icon: 'group',
      onPress: () => {
        navigation.navigate('GroupsList');
      },
    },
    {
      name: i18n.t('moreScreen.settings'),
      icon: 'settings',
      testID: 'Drawer:settings',
      onPress: () => {
        navigation.navigate('Settings');
      },
    },
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
  const isVerificationEnabled = useIsFeatureOn('mob-4472-in-app-verification');

  const handleChannelNav = () => {
    props.navigation.push('Channel', { entity: channel });
  };

  const handleMultiUserNav = () => props.navigation.navigate('MultiUserScreen');

  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const optionsList = getOptionsList(props.navigation, {
    isIosMindsHidden,
    isVerificationEnabled,
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

const DrawerNavItem = ({
  name,
  onPress,
  small,
  testID,
}: {
  icon;
  name;
  onPress;
  small;
  testID?;
}) => {
  const T = small ? B1 : H3;
  return (
    <PressableLine testID={testID} onPress={onPress}>
      <Row align="centerStart" flex left="XL" vertical="M">
        <T font={small ? 'regular' : 'bold'}>{name}</T>
      </Row>
    </PressableLine>
  );
};
