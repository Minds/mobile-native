import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { IconButton, Avatar } from '~ui';
import { observer } from 'mobx-react';
import SearchComponent from './searchbar/SearchComponent';
import ThemedStyles from '../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
            <Avatar
              testID="topbarAvatar"
              onPress={openMenu}
              source={avatar}
              border="solid"
              size="tiny"
              icon="menu"
            />
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
            <IconButton scale onPress={openWallet} name="coins" />
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
