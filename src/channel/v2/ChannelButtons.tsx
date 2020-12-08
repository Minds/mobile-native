import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
import SmallCircleButton from '../../common/components/SmallCircleButton';

type ButtonsType = 'edit' | 'more' | 'wire' | 'subscribe' | 'message' | 'join';

export type ChannelButtonsPropsType = {
  store: ChannelStoreType;
  onEditPress: (ev: GestureResponderEvent) => void;
  notShow?: Array<ButtonsType>;
  containerStyle?: any;
  iconsStyle?: any;
  iconSize?: number;
};

const isIos = Platform.OS === 'ios';

const isSubscribedToTier = (tiers: SupportTiersType[]) =>
  tiers.some((tier) => typeof tier.subscription_urn === 'string');

const check = {
  wire: (store: ChannelStoreType) =>
    !isIos &&
    !store.channel!.blocked &&
    !store.channel!.isOwner() &&
    store.channel!.can(FLAG_WIRE),
  more: () => true,
  message: (store: ChannelStoreType) =>
    !store.channel!.isOwner() &&
    store.channel!.isSubscribed() &&
    store.channel!.can(FLAG_MESSAGE),
  edit: (store: ChannelStoreType) =>
    store.channel!.isOwner() && store.channel?.can(FLAG_EDIT_CHANNEL),
  join: (store: ChannelStoreType) =>
    !store.channel!.isOwner() &&
    store.tiers &&
    store.tiers.length > 0 &&
    !isSubscribedToTier(store.tiers),
  subscribe: (store: ChannelStoreType) =>
    !store.channel!.isOwner() &&
    store.channel!.can(FLAG_SUBSCRIBE) &&
    !store.channel!.subscribed,
};

/**
 * Channel buttons
 */
const ChannelButtons = observer(
  (props: PropsWithChildren<ChannelButtonsPropsType>) => {
    const menuRef = useRef<any>();
    const theme = ThemedStyles.style;
    const navigation = useNavigation<
      NativeStackNavigationProp<AppStackParamList>
    >();

    const SIZE = props.iconSize || 18;

    const openMessenger = useCallback(() => {
      if (!props.store.channel) return null;
      navigation.push('Conversation', {
        conversation: {
          guid: props.store.channel.guid + ':' + sessionService.guid,
        },
      });
    }, [navigation, props.store.channel]);

    const openWire = useCallback(() => {
      navigation.push('WireFab', {
        owner: props.store.channel,
      });
    }, [navigation, props.store.channel]);

    if (!props.store.channel) return null;

    const shouldShow = (button: ButtonsType) =>
      !props.notShow ||
      (!props.notShow.includes(button) && check[button](props.store));

    const showSubscribe = shouldShow('subscribe');

    return (
      <View
        style={[
          theme.rowJustifyEnd,
          theme.marginRight2x,
          props.containerStyle,
        ]}>
        {props.children}

        {shouldShow('edit') && (
          <SmallCircleButton
            name="edit"
            type="material"
            onPress={props.onEditPress}
          />
          // <View style={theme.paddingTop2x}>
          //   <Edit {...props} />
          // </View>
        )}
        {shouldShow('message') && (
          <MIcon
            name="chat-bubble-outline"
            size={SIZE}
            onPress={openMessenger}
            style={props.iconsStyle}
          />
        )}
        {shouldShow('wire') && (
          <MIcon
            name="attach-money"
            size={SIZE}
            onPress={openWire}
            style={props.iconsStyle}
          />
        )}
        {shouldShow('more') && (
          <MIcon
            name="more-horiz"
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
          channel={props.store.channel}
          ref={menuRef}
          isSubscribedToTier={isSubscribedToTier(props.store.tiers)}
        />
      </View>
    );
  },
);

export default ChannelButtons;
