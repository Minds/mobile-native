import React from 'react';
import { ViewStyle } from 'react-native';
import SegmentedButton from '../../../../common/components/SegmentedButton';
import i18n from '../../../../common/services/i18n.service';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { B2, Row } from '~ui';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  onPress?: () => void;
  walletStore: WalletStoreType;
};

const B2C = props => <B2 flat font="medium" {...props} />;

const PaidButton = (props: PropsType) => {
  const children = {
    childrenButton1: (
      <Row align="centerStart">
        <B2C color="secondary">{i18n.t('wallet.unpaid') + ' '}</B2C>
        <B2C>{props.walletStore.stripeDetails.pendingBalanceSplit}</B2C>
      </Row>
    ),
    childrenButton2: (
      <Row align="centerStart">
        <B2C color="secondary">{i18n.t('wallet.total') + ' '}</B2C>
        <B2C>{props.walletStore.stripeDetails.totalPaidOutSplit}</B2C>
      </Row>
    ),
  };
  return <SegmentedButton {...children} onPress={props.onPress} />;
};

export default PaidButton;
