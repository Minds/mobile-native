import React from 'react';

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
import { IconMapNameType } from '~/common/ui/icons/map';
import { useDrawerList } from './drawer/useDrawerList';
import { useDrawerSmallList } from './drawer/useDrawerSmallList';
import { useNavigation } from '@react-navigation/native';
import serviceProvider from '~/services/serviceProvider';

/**
 * Drawer menu
 */
export default function Drawer(props) {
  const channel = serviceProvider.session.getUser();

  const handleChannelNav = () => {
    props.navigation.push('Channel', { entity: channel });
  };

  const handleMultiUserNav = () => props.navigation.navigate('MultiUserScreen');

  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const optionsList = useDrawerList({
    hasPlus: channel.pro,
    hasPro: channel.plus,
  });

  const optionsSmallList = useDrawerSmallList();

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
        {Boolean(optionsSmallList) && (
          <>
            <HairlineSpacer />
            <Spacer vertical="M">
              <DrawerList list={optionsSmallList} small />
            </Spacer>
          </>
        )}
      </FitScrollView>
    </Screen>
  );
}

/**
 * Drawer list component
 */
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

/**
 * Header
 */
const DrawerHeader = ({ name, username, avatar, onUserPress, onIconPress }) => {
  const navigation = useNavigation();
  return (
    <Row left="XL" right="XL" bottom="XXL">
      <IconButton
        name="chevron-left"
        size="huge"
        right="S"
        color="Icon"
        onPress={() => navigation.goBack()}
      />
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

/**
 * Drawer item
 */
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
