import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatePresence, MotiView } from 'moti';

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

import Subscribe, { SubscribeProps } from './buttons/Subscribe';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import Edit from './buttons/Edit';
import { Row } from '~ui';
import SupermindButton from '../../common/components/supermind/SupermindButton';

import { SUPERMIND_ENABLED, WIRE_ENABLED } from '~/config/Config';
import PostSubscription from './buttons/PostSubscription';
import { useCreateChatRoom } from '~/modules/chat/hooks/useCreateChatRoom';
import sp from '~/services/serviceProvider';

export type ButtonsType =
  | 'edit'
  | 'more'
  | 'chat'
  | 'wire'
  | 'subscribe'
  | 'message'
  | 'join'
  | 'supermind'
  | 'postSubscription'
  | 'boost';

export type ChannelButtonsPropsType = {
  store: ChannelStoreType;
  onEditPress: () => void;
  onSearchChannelPressed: () => void;
  notShow?: Array<ButtonsType>;
  containerStyle?: any;
  iconsStyle?: any;
  iconColor?: string;
  iconReverseColor?: string;
  raisedIcons?: boolean;
  subscribeProps?: Partial<SubscribeProps>;
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
  chat: (store: ChannelStoreType) =>
    !store.channel!.isOwner() && store.channel!.isSubscribed(),
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
  postSubscription: (store: ChannelStoreType) =>
    !store.channel!.isOwner() && store.channel!.isSubscribed(),
};

/**
 * Channel buttons
 */
const ChannelButtons = withErrorBoundary(
  observer((props: PropsWithChildren<ChannelButtonsPropsType>) => {
    const menuRef = useRef<any>();
    const navigation =
      useNavigation<NativeStackNavigationProp<AppStackParamList>>();

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
        {shouldShow('wire') && WIRE_ENABLED && (
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
        {shouldShow('postSubscription') && (
          <PostSubscription
            raised={props.raisedIcons}
            guid={props.store.channel.guid}
            iconStyle={iconStyle}
            color={props.iconColor}
            reverseColor={props.iconReverseColor}
          />
        )}
        <AnimatePresence>
          {showSubscribe && (
            <MotiView {...motiViewProps}>
              <Subscribe
                channel={props.store.channel}
                {...props.subscribeProps}
              />
            </MotiView>
          )}
        </AnimatePresence>
        {shouldShow('supermind') && SUPERMIND_ENABLED && (
          <SupermindButton
            entity={props.store.channel}
            style={sp.styles.style.marginLeft2x}
          />
        )}
        {shouldShow('chat') && !sp.permissions.shouldHideCreateChatRoom() && (
          <ChatButton
            raisedIcons={props.raisedIcons}
            iconColor={props.iconColor}
            iconReverseColor={props.iconReverseColor}
            guid={props.store.channel.guid}
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

const ChatButton = ({ raisedIcons, iconColor, iconReverseColor, guid }) => {
  const { createChatRoom, isLoading } = useCreateChatRoom();
  return (
    <SmallCircleButton
      raised={raisedIcons}
      name="chat"
      type="ion"
      onPress={() => {
        if (sp.permissions.canCreateChatRoom(true)) {
          createChatRoom([guid]);
        }
      }}
      disabled={isLoading}
      color={iconColor}
      reverseColor={iconReverseColor}
      iconStyle={iconStyle}
    />
  );
};

const iconStyle = { fontSize: 25 };

const motiViewProps: any = {
  from: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  exitTransition: {
    type: 'timing',
    delay: 700,
    duration: 200,
  },
  transition: { type: 'timing', duration: 150 },
};

export default ChannelButtons;
