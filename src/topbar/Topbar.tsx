import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Image, ViewStyle } from 'react-native';
import { IconCircled, Spacer, IconButton, H2 } from '~ui';
import { observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import PressableScale from '~/common/components/PressableScale';
import TabChatPreModal, { ChatModalHandle } from '~/tabs/TabChatPreModal';
import ChatIcon from '~/chat/ChatIcon';
import { useFeedListContext } from '~/common/components/FeedListSticky';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

type PropsType = {
  navigation: any;
  title?: string;
  noInsets?: boolean;
  shadowLess?: boolean;
  showBack?: boolean;
};

export const Topbar = observer((props: PropsType) => {
  const { wallet } = useStores();
  const user = useCurrentUser();
  const insets = useSafeAreaInsets();
  const animatedContext = useFeedListContext();
  const bgColor = ThemedStyles.getColor('PrimaryBackground');

  const animatedStyle = useAnimatedStyle(() => {
    return animatedContext &&
      !props.shadowLess &&
      animatedContext.scrollY.value > animatedContext.headerHeight &&
      animatedContext.headerHeight !== animatedContext.translationY.value
      ? {
          backgroundColor: bgColor,
          zIndex: 999,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1.5,
          },
          shadowOpacity: 0.35,
          shadowRadius: 1.41,
          elevation: 3,
        }
      : {
          zIndex: 999,
          backgroundColor: bgColor,
          shadowColor: 'transparent',
        };
  }, [animatedContext, bgColor]);

  const container = React.useRef({
    paddingTop: !props.noInsets && insets && insets.top ? insets.top - 5 : 0,
    height: Platform.select({ ios: props.noInsets ? 60 : 100, android: 60 }),
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

  return (
    <Animated.View style={animatedStyle}>
      <TabChatPreModal ref={chatModal} />
      <View style={container}>
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            {props.showBack && (
              <IconButton
                name="chevron-left"
                size="huge"
                right="S"
                color="Icon"
                onPress={() => props.navigation.goBack()}
              />
            )}
            {!!props.title ? (
              <H2>{props.title}</H2>
            ) : (
              <Image
                resizeMode="contain"
                source={
                  ThemedStyles.theme
                    ? require('../assets/logos/logo-white.png')
                    : require('../assets/logos/logo.png')
                }
                style={styles.logo}
              />
            )}
          </View>
          <View style={styles.topbarRight}>
            <Spacer right="L">
              <PressableScale onPress={() => chatModal.current?.showModal()}>
                <ChatIcon />
              </PressableScale>
            </Spacer>
            <PressableScale
              onPress={() => props.navigation.navigate('SearchScreen')}>
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
    marginLeft: 4,
    marginTop: -10,
    aspectRatio: 0.3389,
    width: 105,
  },
  shadow: {
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.41,
    elevation: 3,
  },
  topbar: {
    flex: 1,
    // alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    flexGrow: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topbarRight: {
    width: 75,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 4,
    marginRight: 15,
  },
});
