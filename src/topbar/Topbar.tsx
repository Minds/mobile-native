import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome5';

import { observer } from 'mobx-react';
import SearchComponent from './searchbar/SearchComponent';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BannerInfo from './BannerInfo';
import FastImage from 'react-native-fast-image';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import intword from '../common/helpers/intword';
import colors from '../styles/Colors';

type PropsType = {
  navigation: any;
};

export const Topbar = observer((props: PropsType) => {
  const { wallet } = useStores();
  const user = useCurrentUser();

  // dereference to react to observable changes
  const balance = wallet.balance;

  useEffect(() => {
    if (user) {
      wallet.getTokenAccounts();
    }
  });

  const avatar = user ? user.getAvatarSource('medium') : { uri: '' };

  const openMenu = () => {
    props.navigation.openDrawer();
  };

  const openWallet = () => {
    props.navigation.navigate('Tabs', {
      screen: 'CaptureTab',
      params: { screen: 'Wallet' },
    });
  };

  const theme = ThemedStyles.style;
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        const cleanTop = {
          paddingTop: insets && insets.top ? insets.top - 5 : 0,
        };
        return (
          <View style={[theme.backgroundPrimary, styles.shadow]}>
            <View
              style={[
                styles.container,
                theme.borderBottomHair,
                theme.borderPrimary,
                cleanTop,
              ]}>
              <View style={styles.topbar}>
                <View style={styles.topbarLeft}>
                  <TouchableOpacity onPress={openMenu}>
                    <FastImage
                      source={avatar}
                      style={[styles.avatar, theme.borderIcon]}
                      resizeMode="contain"
                    />
                    <View style={styles.menuIconContainer}>
                      <Icon
                        name="md-menu"
                        style={
                          ThemedStyles.theme
                            ? theme.colorBackgroundPrimary
                            : theme.colorSecondaryText
                        }
                        size={14}
                      />
                    </View>
                  </TouchableOpacity>
                  <SearchComponent navigation={props.navigation} />
                </View>
                <View style={styles.topbarRight}>
                  <Text
                    onPress={openWallet}
                    style={[
                      theme.fontL,
                      theme.colorSecondaryText,
                      theme.paddingRight2x,
                      theme.paddingVertical2x,
                    ]}>
                    {intword(balance)}
                  </Text>
                  <IconFa
                    name="coins"
                    size={20}
                    style={theme.colorIcon}
                    onPress={openWallet}
                  />
                </View>
              </View>
            </View>
            <BannerInfo />
          </View>
        );
      }}
    </SafeAreaInsetsContext.Consumer>
  );
});

export default Topbar;

const styles = StyleSheet.create({
  container: {
    height: Platform.select({ ios: 110, android: 70 }),
    display: 'flex',
    flexDirection: 'row',
    // paddingBottom: 8,
  },
  menuIconContainer: {
    backgroundColor: colors.lightGreyed,
    paddingTop: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -3,
    right: -3,
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.5,
    alignSelf: 'flex-start',
  },
  topbar: {
    flex: 1,
    // alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    flexGrow: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topbarRight: {
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 4,
    marginRight: 5,
  },
  scale0: {
    transform: [{ scale: 0 }],
  },
});
