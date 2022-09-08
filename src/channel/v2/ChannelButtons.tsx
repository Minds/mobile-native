import React, { PropsWithChildren, useCallback, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import {
  FLAG_EDIT_CHANNEL,
  FLAG_MESSAGE,
  FLAG_SUBSCRIBE,
  FLAG_WIRE,
} from '../../common/Permissions';
import ChannelMoreMenu from './ChannelMoreMenu';
import { ChannelStoreType } from './createChannelStore';
import { SupportTiersType } from '../../wire/WireTypes';

import Subscribe from './buttons/Subscribe';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import Edit from './buttons/Edit';
import { Row } from '~ui';
import SupermindButton from '../../common/components/supermind/SupermindButton';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';

type ButtonsType =
  | 'edit'
  | 'more'
  | 'wire'
  | 'subscribe'
  | 'message'
  | 'join'
  | 'supermind'
  | 'boost';

export type ChannelButtonsPropsType = {
  store: ChannelStoreType;
  onEditPress: (ev: GestureResponderEvent) => void;
  onSearchChannelPressed: () => void;
  notShow?: Array<ButtonsType>;
  containerStyle?: any;
  iconsStyle?: any;
  iconSize?: number;
  iconColor?: string;
  iconReverseColor?: string;
  raisedIcons?: boolean;
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
    !store.channel!.isOwner() && store.channel!.can(FLAG_SUBSCRIBE),
  boost: (store: ChannelStoreType) => store.channel!.isOwner(),
  supermind: (store: ChannelStoreType) => !store.channel!.isOwner(),
};

/**
 * Channel buttons
 */
const ChannelButtons = withErrorBoundary(
  observer((props: PropsWithChildren<ChannelButtonsPropsType>) => {
    const menuRef = useRef<any>();
    const navigation = useNavigation<
      NativeStackNavigationProp<AppStackParamList>
    >();

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
      <Row right="S" containerStyle={[props.containerStyle]}>
        {props.children}
        {shouldShow('edit') && <Edit {...props} />}
        {shouldShow('wire') && (
          <SmallCircleButton
            raised={props.raisedIcons}
            name="attach-money"
            type="material"
            onPress={openWire}
            color={props.iconColor}
            reverseColor={props.iconReverseColor}
            iconStyle={iconStyle}
          />
        )}
        {shouldShow('more') && (
          <SmallCircleButton
            raised={props.raisedIcons}
            name="more-horiz"
            type="material"
            onPress={() => {
              menuRef.current?.present();
            }}
            color={props.iconColor}
            reverseColor={props.iconReverseColor}
            iconStyle={iconStyle}
          />
        )}
        {showSubscribe && <Subscribe channel={props.store.channel} />}
        {shouldShow('supermind') && (
          <IfFeatureEnabled feature="mobile-supermind">
            <SupermindButton entity={props.store.channel} />
          </IfFeatureEnabled>
        )}
        {shouldShow('more') && (
          <ChannelMoreMenu
            channel={props.store.channel}
            ref={menuRef}
            onSearchChannelPressed={props.onSearchChannelPressed}
            isSubscribedToTier={isSubscribedToTier(props.store.tiers)}
          />
        )}
      </Row>
    );
  }),
);

const iconStyle = { fontSize: 25 };

export default ChannelButtons;
