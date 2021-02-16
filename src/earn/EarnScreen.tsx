import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import UniswapWidget from '../common/components/uniswap-widget/UniswapWidget';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';

export default function ({ navigation }) {
  const theme = ThemedStyles.style;
  const [showUniswapWidget, setShowUniswapWidget] = useState(false);
  const toggleUniswapWidget = () => setShowUniswapWidget(!showUniswapWidget);

  const navToVideoCapture = () =>
    navigation.push('Capture', { mode: 'text', start: true });

  const openWithdrawal = () => navigation.navigate('WalletWithdrawal');

  const boxStyles = [
    theme.fullWidth,
    theme.border,
    theme.borderBackgroundTertiary,
    theme.padding6x,
    theme.marginBottom3x,
  ];
  const titleStyles = [theme.fontXXL, theme.bold, theme.marginBottom2x];
  const descriptionStyles = [theme.fontL, theme.colorSecondaryText];

  const earnBoxes = [
    {
      name: 'pool',
      onPress: toggleUniswapWidget,
    },
    {
      name: 'transfer',
      onPress: openWithdrawal,
    },
    {
      name: 'create',
      onPress: navToVideoCapture,
    },
    {
      name: 'curate',
      onPress: toggleUniswapWidget,
    },
    {
      name: 'develop',
      onPress: toggleUniswapWidget,
    },
    {
      name: 'refer',
      onPress: toggleUniswapWidget,
    },
  ];

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          theme.rowJustifySpaceBetween,
          theme.padding6x,
          styles.container,
        ]}>
        {earnBoxes.map((box) => (
          <TouchableOpacity style={boxStyles} onPress={box.onPress}>
            <Text style={titleStyles}>
              {i18n.t(`earnScreen.${box.name}.title`)}
            </Text>
            <Text style={descriptionStyles}>
              {i18n.t(`earnScreen.${box.name}.description`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <UniswapWidget
        isVisible={showUniswapWidget}
        action={'add'}
        onCloseButtonPress={toggleUniswapWidget}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
});
