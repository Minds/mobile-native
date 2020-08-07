import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import type UserModel from '../UserModel';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import {
  FLAG_SUBSCRIBE,
  FLAG_MESSAGE,
  FLAG_EDIT_CHANNEL,
  FLAG_WIRE,
} from '../../common/Permissions';
import ChannelMoreMenu from './ChannelMoreMenu';

import type { GestureResponderEvent } from 'react-native';

type PropsType = {
  channel: UserModel;
  onEditPress: (ev: GestureResponderEvent) => void;
};

const isIos = Platform.OS === 'ios';

/**
 * Channel buttons
 */
const ChannelButtons = observer((props: PropsType) => {
  const menuRef = useRef<any>();
  const theme = ThemedStyles.style;
  const navigation = useNavigation<
    NativeStackNavigationProp<AppStackParamList, 'Channel'>
  >();
  const subscriptionText = '+ ' + i18n.t('channel.subscribe');

  const openMessenger = useCallback(() => {
    navigation.push('Conversation', {
      conversation: {
        guid: props.channel.guid + ':' + sessionService.guid,
      },
    });
  }, [navigation, props.channel]);

  const join = useCallback(() => {
    navigation.push('JoinMembershipScreen', {
      user: props.channel,
    });
  }, [navigation, props.channel]);

  const openWire = useCallback(() => {
    navigation.push('WireFab', {
      owner: props.channel,
    });
  }, [navigation, props.channel]);

  const openMore = useCallback(() => {
    if (menuRef.current) {
      menuRef.current.show();
    }
  }, [menuRef]);

  const showWire =
    !isIos &&
    !props.channel.blocked &&
    !props.channel.isOwner() &&
    props.channel.can(FLAG_WIRE);

  const showSubscribe =
    !props.channel.isOwner() &&
    props.channel.can(FLAG_SUBSCRIBE) &&
    !props.channel.subscribed;

  const showMessage =
    !props.channel.isOwner() &&
    props.channel.isSubscribed() &&
    props.channel.can(FLAG_MESSAGE);

  const showEdit =
    props.channel.isOwner() && props.channel.can(FLAG_EDIT_CHANNEL);

  const showJoin = !props.channel.isOwner();

  return (
    <View
      style={[
        theme.rowJustifyEnd,
        styles.marginContainer,
        theme.marginRight2x,
      ]}>
      {showEdit ? (
        <View style={isIos ? undefined : theme.paddingTop2x}>
          <Button
            color={ThemedStyles.getColor('secondary_background')}
            text={i18n.t('channel.editChannel')}
            textStyle={isIos ? theme.fontL : theme.fontM}
            containerStyle={styles.button}
            textColor={ThemedStyles.getColor('primary_text')}
            onPress={props.onEditPress}
            inverted
          />
        </View>
      ) : (
        <Icon
          raised
          reverse
          name="more-horiz"
          type="material"
          color={ThemedStyles.getColor('secondary_background')}
          reverseColor={ThemedStyles.getColor('primary_text')}
          size={15}
          onPress={openMore}
        />
      )}
      {showWire && (
        <Icon
          raised
          reverse
          name="coins"
          type="font-awesome-5"
          color={ThemedStyles.getColor('secondary_background')}
          reverseColor={ThemedStyles.getColor('primary_text')}
          size={15}
          onPress={openWire}
        />
      )}
      {showMessage && (
        <Icon
          raised
          reverse
          name="chat-bubble-outline"
          type="material"
          color={ThemedStyles.getColor('secondary_background')}
          reverseColor={ThemedStyles.getColor('primary_text')}
          size={15}
          onPress={openMessenger}
        />
      )}
      {showJoin && (
        <Button
          color={
            showSubscribe
              ? ThemedStyles.getColor('secondary_background')
              : ThemedStyles.getColor('green')
          }
          text={i18n.t('join')}
          textStyle={[
            isIos ? theme.fontL : theme.fontM,
            !ThemedStyles.theme && !showSubscribe
              ? null
              : theme.colorPrimaryText,
          ]}
          containerStyle={styles.button}
          textColor="white"
          onPress={join}
          inverted
        />
      )}
      {showSubscribe && (
        <Button
          color={ThemedStyles.getColor('green')}
          text={subscriptionText}
          textStyle={isIos ? theme.fontL : theme.fontM}
          containerStyle={styles.button}
          textColor="white"
          onPress={props.channel.toggleSubscription}
          inverted
        />
      )}
      <ChannelMoreMenu channel={props.channel} ref={menuRef} />
    </View>
  );
});

export default ChannelButtons;

const styles = StyleSheet.create({
  marginContainer: {
    marginTop: Platform.select({
      ios: 5,
      android: 0,
    }),
  },
  button: {
    padding: Platform.select({ ios: 8, android: 6 }),
    marginLeft: 5,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
  },
});
