import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome5';

import { observer } from 'mobx-react';
import SearchComponent from './searchbar/SearchComponent';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useStores } from '../common/hooks/use-stores';
import useCurrentUser from '../common/hooks/useCurrentUser';
import intword from '../common/helpers/intword';
import featuresService from '../common/services/features.service';
import EmailConfirmation from './EmailConfirmation';
import MText from '../common/components/MText';

type PropsType = {
  navigation: any;
};

export const Topbar = observer((props: PropsType) => {
  const { wallet } = useStores();
  const user = useCurrentUser();
  const insets = useSafeAreaInsets();
  // dereference to react to observable changes
  const balance = wallet.balance;
  const prices = wallet.prices;
  const usdBalance = balance * parseFloat(prices.minds);

  useEffect(() => {
    if (user) {
      wallet.loadPrices();
      wallet.getTokenAccounts();
    }
  });

  const avatar = React.useMemo(
    () => (user ? user.getAvatarSource('medium') : { uri: '' }),
    [user],
  );

  const cleanTop = React.useRef({
    paddingTop: insets && insets.top ? insets.top - 5 : 0,
  }).current;

  const openMenu = React.useCallback(() => {
    props.navigation.openDrawer();
  }, [props.navigation]);

  const openWallet = React.useCallback(() => {
    props.navigation.navigate('Tabs', {
      screen: 'CaptureTab',
      params: { screen: 'Wallet' },
    });
  }, [props.navigation]);

  const theme = ThemedStyles.style;
  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          theme.borderBottomHair,
          theme.bcolorPrimaryBorder,
          cleanTop,
        ]}>
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            <TouchableOpacity onPress={openMenu} testID="topbarAvatar">
              <FastImage
                source={avatar}
                style={avatarStyle}
                resizeMode="contain"
              />
              <View style={styles.menuIconContainer}>
                <Icon
                  name="md-menu"
                  style={
                    ThemedStyles.theme
                      ? theme.colorPrimaryBackground
                      : theme.colorSecondaryText
                  }
                  size={14}
                />
              </View>
            </TouchableOpacity>
            <SearchComponent navigation={props.navigation} />
          </View>
          <View style={styles.topbarRight}>
            <MText
              onPress={openWallet}
              style={[
                theme.fontL,
                theme.colorSecondaryText,
                theme.paddingRight2x,
                theme.paddingVertical2x,
              ]}>
              {usdBalance > 0 && '$' + intword(usdBalance)}
            </MText>

            <IconFA
              name="coins"
              size={20}
              style={theme.colorIcon}
              onPress={openWallet}
            />
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
  menuIconContainer: {
    backgroundColor: '#d8d8d8',
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

const avatarStyle = ThemedStyles.combine(styles.avatar, 'bcolorIcon');
const containerStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  styles.shadow,
);
