import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Image, ViewStyle } from 'react-native';
import { IconCircled, Spacer, IconButton, H2, Avatar } from '~ui';
import { observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import PressableScale from '~/common/components/PressableScale';
import TabChatPreModal, { ChatModalHandle } from '~/tabs/TabChatPreModal';
import ChatIcon from '~/chat/ChatIcon';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import sessionService from '~/common/services/session.service';
import SendIntentAndroid from 'react-native-send-intent';
import { ANDROID_CHAT_APP } from '~/config/Config';
import { useScrollContext } from '../common/contexts/scroll.context';
import assets from '@assets';

type PropsType = {
  navigation: any;
  title?: string;
  noInsets?: boolean;
  shadowLess?: boolean;
  showBack?: boolean;
};

export const Topbar = observer((props: PropsType) => {
  const { navigation, title, noInsets, shadowLess, showBack } = props;
  const channel = sessionService.getUser();
  const { wallet } = useStores();
  const user = useCurrentUser();
  const insets = useSafeAreaInsets();
  const scrollContext = useScrollContext();
  const bgColor = ThemedStyles.getColor('PrimaryBackground');
  const isChatIconHidden = useChatIconState();

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
    display: 'flex',
    flexDirection: 'row',
  }).current as ViewStyle;
  // dereference to react to observable changes

  const chatModal = React.useRef<ChatModalHandle>(null);
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
      <TabChatPreModal ref={chatModal} />
      <View style={container}>
        <View style={styles.topbar}>
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
            {title ? (
              <H2>{title}</H2>
            ) : (
              <>
                <View style={styles.leftSpacer} />
                <Avatar
                  source={avatar}
                  border={'white'}
                  size="small"
                  onPress={handleChannelNav}
                  testID="Topbar:Avatar"
                />
                <View
                  style={[
                    styles.logoWrapper,
                    isChatIconHidden && styles.noMarginLeft,
                  ]}>
                  <Image
                    resizeMode="contain"
                    source={
                      ThemedStyles.theme ? assets.LOGO_WHITE : assets.LOGO
                    }
                    style={styles.logo}
                  />
                </View>
              </>
            )}
          </View>
          <View style={styles.topbarRight}>
            <Spacer right="L">
              {isChatIconHidden ? null : (
                <PressableScale onPress={() => chatModal.current?.showModal()}>
                  <ChatIcon />
                </PressableScale>
              )}
            </Spacer>
            <PressableScale onPress={() => navigation.navigate('SearchScreen')}>
              <IconCircled size="small" name="search" color="PrimaryText" />
            </PressableScale>
          </View>
        </View>
      </View>

      {/* {props.banners && (
        <>
          <ReferBanner />
          <WefounderBanner />
        </>
      )} */}
    </Animated.View>
  );
});

export default Topbar;

export const styles = StyleSheet.create({
  logo: {
    marginLeft: 4,
    marginTop: -10,
    height: 36,
    width: 105,
  },
  logoWrapper: {
    marginLeft: 28,
    flexGrow: 1,
    alignItems: 'center',
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
    // alignItems: 'center',
    flexDirection: 'row',
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

const useChatIconState = () => {
  const [isChatIconHidden, setChatIconHidden] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SendIntentAndroid.isAppInstalled(ANDROID_CHAT_APP).then(installed => {
        setChatIconHidden(!installed);
      });
    }
  }, []);
  return isChatIconHidden;
};
