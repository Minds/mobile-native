import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
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
import Subscribe from './buttons/Subscribe';
import Edit from './buttons/Edit';
import Join from './buttons/Join';
import channelsService from '../../common/services/channels.service';
import type UserModel from '../UserModel';

type ButtonsType = 'edit' | 'more' | 'wire' | 'subscribe' | 'message' | 'join';

export type ChannelButtonsPropsType = {
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

const check = {
  wire: (store: ChannelStoreType, channel: UserModel) =>
    !isIos && !channel.blocked && !channel.isOwner() && channel.can(FLAG_WIRE),
  more: () => true,
  message: (store: ChannelStoreType, channel: UserModel) =>
    !channel.isOwner() && channel.isSubscribed() && channel.can(FLAG_MESSAGE),
  edit: (store: ChannelStoreType, channel: UserModel) =>
    channel.isOwner() && channel.can(FLAG_EDIT_CHANNEL),
  join: (store: ChannelStoreType, channel: UserModel) =>
    !channel.isOwner() &&
    store.tiers &&
    store.tiers.length > 0 &&
    !isSubscribedToTier(store.tiers),
  subscribe: (store: ChannelStoreType, channel: UserModel) =>
    !channel.isOwner() && channel.can(FLAG_SUBSCRIBE) && !channel.subscribed,
};

/**
 * Channel buttons
 */
const ChannelButtons = observer((props: ChannelButtonsPropsType) => {
  const theme = ThemedStyles.style;
  const [channel, setChannel] = useState<UserModel>();
  const menuRef = useRef<any>();
  const navigation = useNavigation<
    NativeStackNavigationProp<AppStackParamList>
  >();

  const openMessenger = useCallback(() => {
    navigation.push('Conversation', {
      conversation: {
        guid: channel!.guid + ':' + sessionService.guid,
      },
    });
  }, [navigation, channel]);

  const openWire = useCallback(() => {
    navigation.push('WireFab', {
      owner: channel,
    });
  }, [navigation, channel]);

  useEffect(() => {
    let onChannelUpdateCleanup;
    const load = async () => {
      if (props.store.channel) {
        onChannelUpdateCleanup = channelsService.onChannelUpdate(
          setChannel,
          props.store.channel.guid,
        );
      }
    };
    load();
    return () => {
      if (onChannelUpdateCleanup) {
        onChannelUpdateCleanup();
      }
    };
  }, [props.store.channel, setChannel]);

  if (!channel) {
    return null;
  }

  const shouldShow = (button: ButtonsType) =>
    !props.notShow ||
    (!props.notShow.includes(button) && check[button](props.store, channel));

  const showSubscribe = shouldShow('subscribe');

  return (
    <View
      style={[theme.rowJustifyEnd, theme.marginRight2x, props.containerStyle]}>
      {shouldShow('edit') && (
        <View style={isIos ? undefined : theme.paddingTop2x}>
          <Edit {...props} />
        </View>
      )}
      {shouldShow('message') && (
        <MIcon
          name="chat-bubble-outline"
          color={ThemedStyles.getColor('primary_text')}
          size={SIZE}
          onPress={openMessenger}
          style={props.iconsStyle}
        />
      )}
      {shouldShow('wire') && (
        <MIcon
          name="attach-money"
          color={ThemedStyles.getColor('primary_text')}
          size={SIZE}
          onPress={openWire}
          style={props.iconsStyle}
        />
      )}
      {shouldShow('more') && (
        <MIcon
          name="more-horiz"
          color={ThemedStyles.getColor('primary_text')}
          size={22}
          onPress={() => menuRef.current?.show()}
          style={[theme.paddingRight, props.iconsStyle]}
        />
      )}
      {shouldShow('join') && (
        <Join
          showSubscribe={showSubscribe}
          navigation={navigation}
          {...props}
        />
      )}
      {showSubscribe && <Subscribe {...props} />}
      <ChannelMoreMenu
        channel={channel}
        ref={menuRef}
        isSubscribedToTier={isSubscribedToTier(props.store.tiers)}
      />
    </View>
  );
});

export default ChannelButtons;
