import React from 'react';
import { Text, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SegmentedButton from '../../../common/components/SegmentedButton';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../../v2/createWalletStore';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  onPress?: () => void;
  walletStore: WalletStoreType;
  onchainStore: any;
};

const OnchainButton = (props: PropsType) => {
  const theme = ThemedStyles.style;
  const textStyles = [theme.colorPrimaryText, theme.fontM, theme.fontMedium];
  const hasReceiver =
    props.walletStore.wallet.receiver &&
    props.walletStore.wallet.receiver.address;

  const isConnected =
    props.onchainStore.result !== null &&
    props.onchainStore.result.address &&
    props.onchainStore.result.unique;

  const children: any = {};

  children.childrenButton1 = (
    <Text style={[textStyles]}>{props.walletStore.wallet.eth.balance} ETH</Text>
  );

  children.childrenButton2 = !isConnected ? (
    <Text style={textStyles}>
      <Text style={[theme.colorSecondaryText, theme.fontMedium]}>
        {i18n.t(hasReceiver ? 'wallet.reconnect' : 'wallet.connect') + ' '}
        <Icon name="plus-circle" size={15} style={theme.colorPrimaryText} />
      </Text>{' '}
    </Text>
  ) : (
    <Text style={textStyles}>
      <Text style={[theme.colorSecondaryText, theme.fontMedium]}>
        {props.walletStore.wallet.receiver.address?.substr(0, 4)}...
        {props.walletStore.wallet.receiver.address?.substr(-4)}
      </Text>
    </Text>
  );

  return (
    <SegmentedButton
      containerStyle={props.containerStyle}
      {...children}
      onPress={props.onPress}
    />
  );
};

export default OnchainButton;
