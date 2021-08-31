import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { View, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import Join from './buttons/Join';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { useStores } from '../../common/hooks/use-stores';
import ChatButton from './ChatButton';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';

type ButtonsType =
  | 'edit'
  | 'more'
  | 'wire'
  | 'subscribe'
  | 'message'
  | 'join'
  | 'boost';

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
  tiers.some(tier => typeof tier.subscription_urn === 'string');

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
  boost: (store: ChannelStoreType) => store.channel!.isOwner(),
};

/**
 * Channel buttons
 */
const ChannelButtons = withErrorBoundary(
  observer((props: PropsWithChildren<ChannelButtonsPropsType>) => {
    const menuRef = useRef<any>();
    const theme = ThemedStyles.style;
    const navigation = useNavigation<
      NativeStackNavigationProp<AppStackParamList>
    >();
    const { chat } = useStores();

    const SIZE = props.iconSize || 18;

    const boostChannel = useCallback(() => {
      navigation.navigate('BoostChannelScreen', {});
    }, [navigation]);

    const openMessenger = useCallback(() => {
      if (!props.store.channel) return null;

      if (Platform.OS === 'android') {
        try {
          chat.checkAppInstalled().then(installed => {
            if (!installed) {
              return;
            }
            if (props.store.channel) {
              chat.directMessage(props.store.channel.guid);
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        chat.directMessage(props.store.channel.guid);
      }
    }, [chat, props.store.channel]);

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

        {shouldShow('boost') && (
          <SmallCircleButton
            name="trending-up"
            type="material"
            onPress={boostChannel}
          />
        )}
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
          <ChatButton
            size={SIZE}
            chat={chat}
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
            onPress={() => {
              menuRef.current?.present();
            }}
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
        {shouldShow('more') && (
          <ChannelMoreMenu
            channel={props.store.channel}
            ref={menuRef}
            isSubscribedToTier={isSubscribedToTier(props.store.tiers)}
          />
        )}
      </View>
    );
  }),
);

export default ChannelButtons;
