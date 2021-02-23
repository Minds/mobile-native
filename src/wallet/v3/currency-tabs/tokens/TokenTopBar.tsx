import React, { useRef } from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import { Tooltip } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import BalanceInfo from './BalanceInfo';
import OnchainButton from './OnchainButton';
import TokenTabOptions from './TokenTabOptions';

type PropsType = {
  walletStore: WalletStoreType;
  connectWallet: any;
  onchainStore: any;
};

const TokenTopBar = ({
  walletStore,
  connectWallet,
  onchainStore,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const tooltipRef = useRef<any>();
  const screen = useDimensions().screen;
  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.paddingLeft2x,
        theme.marginBottom5x,
      ]}>
      <Tooltip
        ref={tooltipRef}
        closeOnlyOnBackdropPress={true}
        skipAndroidStatusBar={true}
        toggleOnPress={false}
        withOverlay={true}
        overlayColor={'#00000015'}
        containerStyle={theme.borderRadius}
        width={screen.width - 20}
        height={200}
        backgroundColor={ThemedStyles.getColor('secondary_background')}
        popover={<BalanceInfo walletStore={walletStore} />}>
        <Text
          onPress={() => tooltipRef.current.toggleTooltip()}
          style={[styles.minds, theme.mindsSwitchBackgroundSecondary]}>
          {walletStore.balance} MINDS
        </Text>
      </Tooltip>
      <OnchainButton
        containerStyle={theme.marginLeft3x}
        walletStore={walletStore}
        onPress={connectWallet}
        onchainStore={onchainStore}
      />
      <TokenTabOptions />
    </View>
  );
};

const styles = StyleSheet.create({
  minds: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default TokenTopBar;
