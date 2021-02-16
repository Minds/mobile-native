import { observer } from 'mobx-react';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../../../../../common/services/i18n.service';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import Setup from './Setup';

const bannerAspectRatio = 3.5;

const Header = () => {
  return (
    <ImageBackground
      style={styles.banner}
      source={require('../../../../../assets/withdrawalbg.jpg')}
      resizeMode="cover">
      <View style={styles.textContainer}>
        <Text style={styles.title}>{i18n.t('wallet.transferToOnchain')}</Text>
      </View>
    </ImageBackground>
  );
};

const WalletWithdrawal = observer(() => {
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const cleanTop = insets.top
    ? { marginTop: insets.top + 50 }
    : { marginTop: 50 };
  return (
    <View style={[styles.container, theme.backgroundPrimary, cleanTop]}>
      <Header />
      <Setup />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  minds: {
    color: '#FFFFFF',
    fontSize: 17,
    paddingBottom: 5,
    fontFamily: 'Roboto-Black',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
    borderWidth: 0,
  },
  switchText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});

export default WalletWithdrawal;
