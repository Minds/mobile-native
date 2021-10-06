import React from 'react';
import {
  Keyboard,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import { FLAG_SUBSCRIBE, FLAG_VIEW } from '../Permissions';
import ThemedStyles, { useStyle } from '../../styles/ThemedStyles';
import type UserModel from '../../channel/UserModel';
import FastImage from 'react-native-fast-image';
import Subscribe from '../../channel/v2/buttons/Subscribe';
import MText from './MText';

type PropsType = {
  channel: UserModel;
  navigation?: any;
  onUserTap?: Function;
  hideButtons?: boolean;
  testID?: string;
  containerStyles?: ViewStyle;
  renderRight?: any;
  nameStyles?: TextStyle;
  usernameStyles?: TextStyle;
};

const ChannelListItem = (props: PropsType) => {
  const containerStyle = useStyle(
    styles.container,
    props.containerStyles || {},
  );
  const nameStyles = useStyle(props.nameStyles || {}, styles.name);
  const usernameStyles = useStyle(props.usernameStyles || {}, styles.username);
  const _navToChannel = React.useCallback(() => {
    Keyboard.dismiss();
    if (props.onUserTap) {
      props.onUserTap(props.channel);
    }
    if (props.navigation) {
      if (props.channel.isOpen() && !props.channel.can(FLAG_VIEW, true)) {
        return;
      }
      props.navigation.push('Channel', { entity: props.channel });
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

    return <Subscribe channel={channel} />;
  }, [props]);

  const { ...otherProps } = props;

  return (
    <TouchableHighlight activeOpacity={0.9} onPress={_navToChannel}>
      <View style={containerStyle} {...otherProps}>
        <FastImage
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
      </View>
    </TouchableHighlight>
  );
};

export default ChannelListItem;

const bodyStyle = {
  marginLeft: 8,
};

const styles = ThemedStyles.create({
  container: [
    {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: 17,
    },
    'paddingHorizontal2x',
    'bcolorPrimaryBorder',
    'borderBottom1x',
    'bgPrimaryBackground',
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
