import React from 'react';
import { Keyboard, TextStyle, View, ViewStyle } from 'react-native';
import TurboImage from 'react-native-turbo-image';

import { FLAG_SUBSCRIBE, FLAG_VIEW } from '../Permissions';
import type UserModel from '../../channel/UserModel';
import Subscribe from '../../channel/v2/buttons/Subscribe';
import MText from './MText';
import MPressable from './MPressable';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

export type ChannelListItemProps = {
  onPress?: (channel: UserModel) => void;
  channel: UserModel;
  navigation?: any;
  onUserTap?: Function;
  hideButtons?: boolean;
  testID?: string;
  containerStyles?: ViewStyle;
  renderRight?: any;
  nameStyles?: TextStyle;
  usernameStyles?: TextStyle;
  /**
   * whether the feed should be updated after a channel
   * was subscribed/unsubscribed
   */
  updateFeed?: boolean;
  borderless?: boolean;
};

const ChannelListItem = (props: ChannelListItemProps) => {
  const containerStyle = useStyle(
    styles.container,
    props.borderless ? null : sp.styles.style.borderBottom,
    props.containerStyles || {},
  );
  const nameStyles = useStyle(props.nameStyles || {}, styles.name);
  const usernameStyles = useStyle(props.usernameStyles || {}, styles.username);
  const _onPress = React.useCallback(() => {
    if (props.onPress) {
      props.onPress(props.channel);
      return;
    }

    Keyboard.dismiss();
    if (props.onUserTap) {
      props.onUserTap(props.channel);
    }
    if (props.navigation) {
      if (props.channel.isOpen() && !props.channel.can(FLAG_VIEW, true)) {
        return;
      }

      if (props.navigation === sp.navigation) {
        props.navigation.push('App', {
          screen: 'Channel',
          params: {
            guid: props.channel.guid,
            entity: props.channel,
          },
        });
      } else {
        props.navigation.push('Channel', {
          guid: props.channel.guid,
          entity: props.channel,
        });
      }
    }
  }, [props]);

  const renderRightButton = React.useCallback(() => {
    if (props.renderRight) {
      const RenderRight = props.renderRight;

      return <RenderRight />;
    }
    const channel = props.channel;

    if (
      channel.isOwner() ||
      props.hideButtons ||
      (channel.isOpen() && !channel.can(FLAG_SUBSCRIBE))
    ) {
      return;
    }

    return (
      <Subscribe mini shouldUpdateFeed={props.updateFeed} channel={channel} />
    );
  }, [props]);

  const { ...otherProps } = props;

  return (
    <MPressable style={containerStyle} {...otherProps} onPress={_onPress}>
      <TurboImage
        source={props.channel.getAvatarSource('medium')}
        style={styles.avatar}
      />
      <View style={styles.nameContainer}>
        <MText style={nameStyles}>{props.channel.name}</MText>
        <MText
          style={usernameStyles}
          testID={`username${props.channel.username}`}>
          @{props.channel.username}
        </MText>
      </View>
      {renderRightButton()}
    </MPressable>
  );
};

export default ChannelListItem;

const bodyStyle = {
  marginLeft: 8,
};

const styles = sp.styles.create({
  container: [
    {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: 17,
    },
    'paddingHorizontal4x',
    'bcolorPrimaryBorder',
  ],
  nameContainer: ['flexContainerCenter', 'paddingLeft2x', 'justifyCenter'],
  name: [bodyStyle, 'fontL'],
  username: [bodyStyle, 'fontS', 'colorSecondaryText', { marginTop: 1 }],
  avatar: [
    {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    'bgTertiaryBackground',
  ],
});
