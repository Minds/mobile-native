import React, { useRef } from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import { Tooltip } from 'react-native-elements';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import BalanceInfo from './BalanceInfo';
import OnchainButton from './OnchainButton';
import TokenTabOptions from './TokenTabOptions';
import MindsTokens from '../MindsTokens';

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
    <View style={[theme.paddingLeft2x, theme.marginBottom5x]}>
      <View style={[theme.rowJustifyStart, theme.marginBottom]}>
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
          <TouchableOpacity
            style={[theme.mindsSwitchBackgroundSecondary, styles.touchable]}
            onPress={() => tooltipRef.current.toggleTooltip()}>
            <MindsTokens
              mindsPrice={walletStore.prices.minds}
              value={walletStore.balance.toString()}
              textStyles={styles.minds}
            />
          </TouchableOpacity>
        </Tooltip>
      </View>
      <View style={theme.rowJustifyStart}>
        <OnchainButton
          walletStore={walletStore}
          onPress={connectWallet}
          onchainStore={onchainStore}
        />
        <TokenTabOptions />
      </View>
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
    overflow: 'hidden',
  },
  touchable: {
    height: 42,
    borderRadius: 20,
  },
});

export default TokenTopBar;
