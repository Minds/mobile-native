import React from 'react';
import { Text, ViewStyle } from 'react-native';
import SegmentedButton from '../../../common/components/SegmentedButton';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../../v2/createWalletStore';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  onPress?: () => void;
  walletStore: WalletStoreType;
};

const PaidButton = (props: PropsType) => {
  const theme = ThemedStyles.style;
  const textStyles = [theme.colorPrimaryText, theme.fontM, theme.fontMedium];
  const children = {
    childrenButton1: (
      <Text style={[textStyles]}>
        <Text style={theme.colorSecondaryText}>{i18n.t('wallet.unpaid')}</Text>{' '}
        {props.walletStore.stripeDetails.pendingBalanceSplit}
      </Text>
    ),
    childrenButton2: (
      <Text style={textStyles}>
        <Text style={theme.colorSecondaryText}>{i18n.t('wallet.total')}</Text>{' '}
        {props.walletStore.stripeDetails.totalPaidOutSplit}
      </Text>
    ),
  };
  return (
    <SegmentedButton
      containerStyle={props.containerStyle}
      {...children}
      onPress={props.onPress}
    />
  );
};

export default PaidButton;
