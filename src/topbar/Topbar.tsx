import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Image, ViewStyle } from 'react-native';
import { IconCircled, IconButton, H2, Avatar } from '~ui';
import { observer } from 'mobx-react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import PressableScale from '~/common/components/PressableScale';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SendIntentAndroid from 'react-native-send-intent';
import { ANDROID_CHAT_APP, CHAT_ENABLED, IS_TENANT } from '~/config/Config';
import { useScrollContext } from '../common/contexts/scroll.context';
import assets from '@assets';
import { useFeature } from 'ExperimentsProvider';
import sp from '~/services/serviceProvider';

type PropsType = {
  navigation: any;
  title?: string;
  noInsets?: boolean;
  shadowLess?: boolean;
  showBack?: boolean;
  onLogoPress?: (e: any) => void;
};

export const Topbar = observer((props: PropsType) => {
  const { navigation, title, noInsets, shadowLess, showBack } = props;
  const channel = sp.session.getUser();
  const { wallet } = useStores();
  const user = useCurrentUser();
  const insets = useSafeAreaInsets();
  const scrollContext = useScrollContext();
  const bgColor = sp.styles.getColor('PrimaryBackground');
  const isInterChatEnabled = useFeature('epic-358-chat-mob');
  const isChatIconHidden = useChatIconState(Boolean(isInterChatEnabled));

  const animatedStyle = useAnimatedStyle(() => {
    return scrollContext &&
      !shadowLess &&
      scrollContext.scrollY.value > scrollContext.headerHeight &&
      scrollContext.headerHeight !== scrollContext.translationY.value
      ? {
          backgroundColor: bgColor,
          zIndex: 999,
          shadowColor: '#000',
        }
      : {
          backgroundColor: bgColor,
          zIndex: 999,
          shadowColor: 'transparent',
        };
  }, [scrollContext, bgColor]);

  const container = React.useRef({
    paddingTop: !noInsets && insets && insets.top ? insets.top - 5 : 0,
    height: Platform.select({ ios: noInsets ? 60 : 100, android: 60 }),
    justifyContent: 'center',
  }).current as ViewStyle;
  // dereference to react to observable changes

  useEffect(() => {
    if (user) {
      wallet.loadPrices();
      wallet.getTokenAccounts();
    }
  });

  const handleChannelNav = () => {
    navigation.push('Channel', { entity: channel });
  };

  const avatar = channel.getAvatarSource?.('medium') ?? {};

  return (
    <Animated.View style={[styles.shadow, animatedStyle]}>
      <View style={container}>
        <View style={styles.topbar}>
          {!title && (
            <View
              style={[
                styles.logoWrapper,
                isChatIconHidden && styles.noMarginLeft,
              ]}>
              <PressableScale onPress={props.onLogoPress}>
                <Image
                  resizeMode="contain"
                  source={
                    sp.styles.theme
                      ? assets.LOGO_HORIZONTAL_DARK
                      : assets.LOGO_HORIZONTAL
                  }
                  style={styles.logo}
                />
              </PressableScale>
            </View>
          )}
          <View style={styles.topbarLeft}>
            {showBack && (
              <IconButton
                name="chevron-left"
                size="huge"
                right="S"
                color="Icon"
                onPress={() => navigation.goBack()}
              />
            )}
            <IconButton
              name="menu"
              size="large"
              right="S"
              color="Icon"
              onPress={() => navigation.push('More')}
            />
            {title ? (
              <H2>{title}</H2>
            ) : (
              <>
                <View style={styles.leftSpacer} />
                <Avatar
                  source={avatar}
                  border={'white'}
                  size="tiny"
                  onPress={handleChannelNav}
                  testID="Topbar:Avatar"
                />
              </>
            )}
          </View>
          <View style={styles.topbarRight}>
            <PressableScale onPress={() => navigation.navigate('SearchScreen')}>
              <IconCircled size="small" name="search" color="PrimaryText" />
            </PressableScale>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

export default Topbar;

export const styles = StyleSheet.create({
  logo: {
    height: 36,
    width: 105,
    marginTop: IS_TENANT ? 0 : -14,
  },
  logoWrapper: {
    marginLeft: 28,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    zIndex: 999,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 1.41,
    elevation: 3,
  },
  topbar: {
    flex: 1,
    flexDirection: 'row',
    ...sp.styles.style.alignSelfCenterMaxWidth,
  },
  topbarLeft: {
    flex: 1,
    flexGrow: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topbarRight: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 16,
  },
  leftSpacer: {
    width: 5,
  },
  noMarginLeft: {
    marginLeft: 0,
  },
});

// To be removed with epic-358-chat-mob
const useChatIconState = (isInterChatEnabled: boolean) => {
  const [isChatIconHidden, setChatIconHidden] = useState(
    !CHAT_ENABLED || isInterChatEnabled,
  );

  useEffect(() => {
    if (Platform.OS === 'android' && CHAT_ENABLED && !isInterChatEnabled) {
      SendIntentAndroid.isAppInstalled(ANDROID_CHAT_APP).then(installed => {
        setChatIconHidden(!installed);
      });
    }
  }, [isInterChatEnabled]);
  return isChatIconHidden;
};
