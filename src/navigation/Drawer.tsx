import React from 'react';
import i18n from '../common/services/i18n.service';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import FitScrollView from '../common/components/FitScrollView';
import requirePhoneValidation from '../common/hooks/requirePhoneValidation';
import {
  H2,
  H3,
  B1,
  Spacer,
  Row,
  Column,
  HairlineSpacer,
  IconButton,
  Icon,
  Avatar,
  Screen,
  PressableLine,
} from '~ui';
import FadeFrom from '~/common/components/animations/FadeFrom';

const getOptionsList = navigation => {
  const hasRewards = sessionService.getUser().rewards;

  let list = [
    featuresService.has('plus-2020')
      ? {
          name: i18n.t('wire.lock.plus'),
          icon: 'queue',
          onPress: () => {
            navigation.navigate('PlusDiscoveryScreen');
          },
        }
      : null,
    featuresService.has('crypto')
      ? {
          name: i18n.t('moreScreen.wallet'),
          icon: 'bank',
          onPress: () => {
            navigation.navigate('Wallet');
          },
        }
      : null,
    {
      name: i18n.t('earnScreen.title'),
      icon: 'money',
      onPress: () => {
        navigation.navigate('EarnModal');
      },
    },
    {
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
  return (
    <Screen safe>
      <FitScrollView>
        <HairlineSpacer top="XXL">
          <FadeFrom direction="top">
            <DrawerHeader
              avatar={avatar}
              username={channel.username}
              name={channel.name}
              onIconPress={handleMultiUserNav}
              onUserPress={handleChannelNav}
            />
          </FadeFrom>
        </HairlineSpacer>
        <Spacer top="XXL">
          <DrawerList list={optionsList} />
        </Spacer>
      </FitScrollView>
    </Screen>
  );
}

const DrawerList = ({ list }) => {
  return list.map((l, i) =>
    !l ? null : (
      <FadeFrom direction="left" delay={i * 50}>
        <DrawerNavItem
          key={'list' + i}
          name={l.name}
          icon={l.icon}
          onPress={l.onPress}
        />
      </FadeFrom>
    ),
  );
};

const DrawerHeader = ({ name, username, avatar, onUserPress, onIconPress }) => {
  return (
    <Row left="XL2" right="XL" bottom="XXL">
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

const DrawerNavItem = ({ icon, name, onPress }) => {
  return (
    <PressableLine onPress={onPress}>
      <Row align="centerStart" flex left="XL2" vertical="L">
        <Icon name={icon} />
        <H3 left="S" font="bold">
          {name}
        </H3>
      </Row>
    </PressableLine>
  );
};
