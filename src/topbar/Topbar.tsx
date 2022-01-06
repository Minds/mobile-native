import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Image, ViewStyle } from 'react-native';
import { IconCircled, Spacer, H1 } from '~ui';
import { observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import featuresService from '../common/services/features.service';
import EmailConfirmation from './EmailConfirmation';
import PressableScale from '~/common/components/PressableScale';
import TabChatPreModal, { ChatModalHandle } from '~/tabs/TabChatPreModal';

type PropsType = {
  navigation: any;
  title?: string;
  noInsets?: boolean;
};

export const Topbar = observer((props: PropsType) => {
  const { wallet } = useStores();
  const user = useCurrentUser();
  const insets = useSafeAreaInsets();
  const container = React.useRef({
    paddingTop: !props.noInsets && insets && insets.top ? insets.top - 5 : 0,
    height: Platform.select({ ios: props.noInsets ? 70 : 110, android: 70 }),
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
    <View style={containerStyle}>
      <TabChatPreModal ref={chatModal} />
      <View style={container}>
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            {!!props.title ? (
              <H1>{props.title}</H1>
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
                <IconCircled size="small" name="chat-solid" color="White" />
              </PressableScale>
            </Spacer>
            <PressableScale
              onPress={() => props.navigation.navigate('SearchScreen')}>
              <IconCircled size="small" name="search" color="White" />
            </PressableScale>
          </View>
        </View>
      </View>
      {!featuresService.has('onboarding-october-2020') && <EmailConfirmation />}
    </View>
  );
});

export default Topbar;

export const styles = StyleSheet.create({
  container: {
    height: Platform.select({ ios: 110, android: 70 }),
    display: 'flex',
    flexDirection: 'row',
    // paddingBottom: 8,
  },
  logo: {
    marginTop: -12,
    width: 130,
    height: 45,
  },
  shadow: {
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
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
  scale0: {
    transform: [{ scale: 0 }],
  },
});

const containerStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  styles.shadow,
);
