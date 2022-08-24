import React from 'react';

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import FitScrollView from '../common/components/FitScrollView';
import requirePhoneValidation from '../common/hooks/requirePhoneValidation';
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
import openUrlService from '~/common/services/open-url.service';
import { showNotification } from 'AppMessages';
import { IS_IOS } from '~/config/Config';

/**
 * Retrieves the link & jwt for zendesk and navigate to it.
 */
const navigateToHelp = async () => {
  try {
    const response = await apiService.get<any>('api/v3/helpdesk/zendesk', {
      returnUrl: 'true',
    });
    if (response && response.url) {
      openUrlService.openLinkInInAppBrowser(unescape(response.url));
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
        navigateToHelp();
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

const getOptionsList = navigation => {
  const hasRewards = sessionService.getUser().rewards;

  let list = [
    {
      name: i18n.t('wire.lock.plus'),
      icon: 'queue',
      onPress: () => {
        navigation.navigate('PlusDiscoveryScreen');
      },
    },
    {
      name: i18n.t('moreScreen.wallet'),
      icon: 'bank',
      onPress: () => {
        navigation.navigate('Wallet');
      },
    },
    IS_IOS
      ? {
          name: 'Buy Tokens',
          icon: 'coins',
          onPress: async () => {
            const navToBuyTokens = () => {
              navigation.navigate('BuyTokens');
            };
            if (!hasRewards) {
              await requirePhoneValidation();
              navToBuyTokens();
            } else {
              navToBuyTokens();
            }
          },
        }
      : null,
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

  const handleChannelNav = () => {
    props.navigation.push('Channel', { entity: channel });
  };

  const handleMultiUserNav = () => props.navigation.navigate('MultiUserScreen');

  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const optionsList = getOptionsList(props.navigation);
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

const DrawerNavItem = ({ icon, name, onPress, small }) => {
  const T = small ? B1 : H3;
  return (
    <PressableLine onPress={onPress}>
      <Row align="centerStart" flex left="XL" vertical="M">
        <T font={small ? 'regular' : 'bold'}>{name}</T>
      </Row>
    </PressableLine>
  );
};
