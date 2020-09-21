import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
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

type PropsType = {
  store: ChannelStoreType;
  onEditPress: (ev: GestureResponderEvent) => void;
};

const isIos = Platform.OS === 'ios';

const isSubscribedToTier = (tiers: SupportTiersType[]) =>
  tiers.some((tier) => typeof tier.subscription_urn === 'string');

/**
 * Channel buttons
 */
const ChannelButtons = observer((props: PropsWithChildren<PropsType>) => {
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

  const showWire =
    !isIos &&
    !props.store.channel.blocked &&
    !props.store.channel.isOwner() &&
    props.store.channel.can(FLAG_WIRE);

  const showSubscribe =
    !props.store.channel.isOwner() &&
    props.store.channel.can(FLAG_SUBSCRIBE) &&
    !props.store.channel.subscribed;

  const showMessage =
    !props.store.channel.isOwner() &&
    props.store.channel.isSubscribed() &&
    props.store.channel.can(FLAG_MESSAGE);

  const showEdit =
    props.store.channel.isOwner() && props.store.channel.can(FLAG_EDIT_CHANNEL);

  const showJoin =
    !props.store.channel.isOwner() &&
    props.store.tiers &&
    props.store.tiers.length > 0 &&
    !isTierSubscribed;

  return (
    <View
      style={[
        theme.rowJustifyEnd,
        styles.marginContainer,
        theme.marginRight2x,
      ]}>
      {props.children}

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
          name="attach-money"
          type="material"
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
