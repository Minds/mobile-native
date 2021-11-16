import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

import SegmentedButton from '../../../../common/components/SegmentedButton';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../v2/createWalletStore';
import {
  UniqueOnChainStoreType,
  isConnected as isWalletConnected,
} from '../../useUniqueOnchain';
import { B2, Icon, Row } from '~ui';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  onPress?: () => void;
  walletStore: WalletStoreType;
  onchainStore: UniqueOnChainStoreType;
  style?: StyleProp<ViewStyle>;
};

const B2C = props => <B2 flat font="medium" {...props} />;

const OnchainButton = observer((props: PropsType) => {
  const hasReceiver =
    props.walletStore.wallet.receiver &&
    props.walletStore.wallet.receiver.address;

  const isConnected = isWalletConnected(props.onchainStore);

  const children: any = {};

  children.childrenButton1 = (
    <B2C>{props.walletStore.wallet.eth.balance} ETH</B2C>
  );

  children.childrenButton2 = !isConnected ? (
    <Row align="centerBoth">
      <B2C color="secondary">
        {i18n.t(hasReceiver ? 'wallet.reconnect' : 'wallet.connect') + ' '}
      </B2C>
      <Icon name="plus-circle" size="tiny" />
    </Row>
  ) : (
    <B2C color="secondary">
      {props.walletStore.wallet.receiver.address?.substr(0, 6)}...
      {props.walletStore.wallet.receiver.address?.substr(-6)}
    </B2C>
  );

  return props.onchainStore.loading ? (
    <View style={styles.loader}>
      <ActivityIndicator color={ThemedStyles.getColor('Link')} size="small" />
    </View>
  ) : (
    <SegmentedButton {...children} onPress={props.onPress} />
  );
});

const styles = ThemedStyles.create({
  loader: {
    minHeight: 39,
    minWidth: 206,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnchainButton;
