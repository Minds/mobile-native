import React, { Component, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { observer, inject } from 'mobx-react';

import SearchComponent from './SearchComponent';
import navigation from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import MessengerTabIcon from '../messenger/MessengerTabIconNew';

import EmailConfirmation from './EmailConfirmation';
import BannerInfo from './BannerInfo';
import { useLegacyStores } from '../common/hooks/use-stores';

interface Props {
  title: string;
  style?: StyleProp<ViewStyle>;
  refreshFeed?: Function;
  navigation: any;
}

export const Topbar = observer((props: Props) => {
  const { wallet, user } = useLegacyStores();

  useEffect(() => {
    wallet.refresh();
  }, []);

  const listenForSearch = () => (user.searching ? styles.scale0 : {});

  const CS = ThemedStyles.style;

  return (
    <SafeAreaConsumer>
      {(insets) => (
        <View>
          <View
            style={[
              styles.container,
              CS.backgroundSecondary,
              { paddingTop: insets!.top + 10 },
            ]}>
            <View style={styles.topbar}>
              <View style={[styles.topbarLeft, CS.marginLeft4x]}>
                <Text
                  style={[
                    CS.titleText,
                    CS.colorPrimaryText,
                    styles.lineHeight0,
                  ]}
                  onPress={() =>
                    props.refreshFeed ? props.refreshFeed : () => {}
                  }>
                  {props.title}
                </Text>
              </View>
              <View style={styles.topbarRight}>
                <MessengerTabIcon navigation={props.navigation} />
                <SearchComponent user={user} navigation={props.navigation} />
              </View>
            </View>
          </View>

          <EmailConfirmation user={user} />
          <BannerInfo user={user} />
        </View>
      )}
    </SafeAreaConsumer>
  );
});

export default Topbar;

let topbarHeight = 50;

if (Platform.OS === 'ios') {
  topbarHeight = 90;
}

const styles = StyleSheet.create({
  lineHeight0: {
    lineHeight: 28,
  },
  container: {
    height: topbarHeight,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  topbar: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  topbarLeft: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  topbarRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 4,
    marginRight: 5,
    paddingTop: 4,
  },
  button: {
    paddingHorizontal: 10,
  },
  scale0: {
    transform: [{ scale: 0 }],
  },
});
