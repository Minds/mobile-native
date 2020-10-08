import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import {
  FLAG_SUBSCRIBE,
  FLAG_MESSAGE,
  FLAG_EDIT_CHANNEL,
  FLAG_WIRE,
} from '../../common/Permissions';
import ChannelMoreMenu from './ChannelMoreMenu';

import type { GestureResponderEvent } from 'react-native';
import { ChannelStoreType } from './createChannelStore';
import { SupportTiersType } from '../../wire/WireTypes';

type ButtonsType = 'edit' | 'more' | 'wire' | 'subscribe' | 'message' | 'join';

type PropsType = {
  store: ChannelStoreType;
  onEditPress: (ev: GestureResponderEvent) => void;
  notShow?: Array<ButtonsType>;
  containerStyle?: any;
  iconsStyle?: any;
};

const isIos = Platform.OS === 'ios';

const isSubscribedToTier = (tiers: SupportTiersType[]) =>
  tiers.some((tier) => typeof tier.subscription_urn === 'string');

const SIZE = 18;

/**
 * Channel buttons
 */
const ChannelButtons = observer((props: PropsType) => {
  const menuRef = useRef<any>();
  const theme = ThemedStyles.style;
  const navigation = useNavigation<
    NativeStackNavigationProp<AppStackParamList>
  >();
  const subscriptionText = '+ ' + i18n.t('channel.subscribe');
  const isTierSubscribed = isSubscribedToTier(props.store.tiers);

  const openMessenger = useCallback(() => {
    if (!props.store.channel) return null;
    navigation.push('Conversation', {
      conversation: {
        guid: props.store.channel.guid + ':' + sessionService.guid,
      },
    });
  }, [navigation, props.store.channel]);

  const join = useCallback(() => {
    if (props.store.channel) {
      navigation.push('JoinMembershipScreen', {
        user: props.store.channel,
        tiers: props.store.tiers,
      });
    }
  }, [navigation, props.store.channel, props.store.tiers]);

  const openWire = useCallback(() => {
    navigation.push('WireFab', {
      owner: props.store.channel,
    });
  }, [navigation, props.store.channel]);

  const openMore = useCallback(() => {
    if (menuRef.current) {
      menuRef.current.show();
    }
  }, [menuRef]);

  if (!props.store.channel) return null;

  const shouldShow = (button: ButtonsType) =>
    !props.notShow || !props.notShow.includes(button);

  const showWire =
    !isIos &&
    !props.store.channel.blocked &&
    !props.store.channel.isOwner() &&
    props.store.channel.can(FLAG_WIRE) &&
    shouldShow('wire');

  const showSubscribe =
    !props.store.channel.isOwner() &&
    props.store.channel.can(FLAG_SUBSCRIBE) &&
    !props.store.channel.subscribed &&
    shouldShow('subscribe');

  const showMessage =
    !props.store.channel.isOwner() &&
    props.store.channel.isSubscribed() &&
    props.store.channel.can(FLAG_MESSAGE) &&
    shouldShow('message');

  const showEdit =
    props.store.channel.isOwner() &&
    props.store.channel.can(FLAG_EDIT_CHANNEL) &&
    shouldShow('edit');

  const showJoin =
    !props.store.channel.isOwner() &&
    props.store.tiers &&
    props.store.tiers.length > 0 &&
    !isTierSubscribed &&
    shouldShow('join');

  const showMore = shouldShow('more');

  return (
    <View
      style={[theme.rowJustifyEnd, theme.marginRight2x, props.containerStyle]}>
      {showEdit && (
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
      )}
      {showMessage && (
        <MIcon
          name="chat-bubble-outline"
          color={ThemedStyles.getColor('primary_text')}
          size={SIZE}
          onPress={openMessenger}
          style={props.iconsStyle}
        />
      )}
      {showWire && (
        <MIcon
          name="attach-money"
          color={ThemedStyles.getColor('primary_text')}
          size={SIZE}
          onPress={openWire}
          style={props.iconsStyle}
        />
      )}
      {showMore && (
        <MIcon
          name="more-horiz"
          color={ThemedStyles.getColor('primary_text')}
          size={22}
          onPress={openMore}
          style={[theme.paddingRight, props.iconsStyle]}
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
          onPress={props.store.channel.toggleSubscription}
          inverted
        />
      )}
      <ChannelMoreMenu
        channel={props.store.channel}
        ref={menuRef}
        isSubscribedToTier={isTierSubscribed}
      />
    </View>
  );
});

export default ChannelButtons;

const styles = StyleSheet.create({
  button: {
    padding: Platform.select({ ios: 8, android: 6 }),
    marginLeft: 5,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
  },
});
