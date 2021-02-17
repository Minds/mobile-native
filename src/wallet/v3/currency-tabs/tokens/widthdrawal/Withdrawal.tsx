import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWalletConnect from '../../../../../blockchain/v2/walletconnect/useWalletConnect';
import ModalHeader from '../../../../../common/components/ModalHeader';
import { useStores } from '../../../../../common/hooks/use-stores';
import i18n from '../../../../../common/services/i18n.service';
import sessionService from '../../../../../common/services/session.service';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../../v2/createWalletStore';
import Setup from './Setup';
import WithdrawalInput from './WithdrawalInput';

const bannerAspectRatio = 3.5;

const Withdrawal = observer(() => {
  const theme = ThemedStyles.style;
  const walletStore: WalletStoreType = useStores().wallet;
  const wc = useWalletConnect();
  const navigation = useNavigation();
  const user = sessionService.getUser();
  const insets = useSafeAreaInsets();
  const showSetup = !user.rewards || !user.plus;
  const cleanTop = insets.top
    ? { marginTop: insets.top + 50 }
    : { marginTop: 50 };
  return (
    <View style={[styles.container, theme.backgroundPrimary, cleanTop]}>
      <ModalHeader
        source={require('../../../../../assets/withdrawalbg.jpg')}
        title={i18n.t('wallet.transferToOnchain')}
      />
      {showSetup && (
        <Setup navigation={navigation} user={user} walletStore={walletStore} />
      )}
      {!showSetup && (
        <WithdrawalInput
          walletStore={walletStore}
          navigation={navigation}
          wc={wc}
        />
      )}
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

export default Withdrawal;
