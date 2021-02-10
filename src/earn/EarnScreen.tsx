import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import UniswapWidget from '../common/components/uniswap-widget/UniswapWidget';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
});

export default function () {
  const theme = ThemedStyles.style;
  const [showUniswapWidget, setShowUniswapWidget] = useState(false);
  const toggleUniswapWidget = () => setShowUniswapWidget(!showUniswapWidget);

  const boxStyles = [
    theme.fullWidth,
    theme.border,
    theme.borderBackgroundTertiary,
    theme.padding6x,
    theme.marginBottom3x,
  ];
  const titleStyles = [theme.fontXXL, theme.bold, theme.marginBottom2x];
  const descriptionStyles = [theme.fontL, theme.colorSecondaryText];

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          theme.rowJustifySpaceBetween,
          theme.padding6x,
          styles.container,
        ]}>
        <Pressable style={boxStyles} onPress={toggleUniswapWidget}>
          <Text style={titleStyles}>{i18n.t('earnScreen.pool.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.pool.description')}
          </Text>
        </Pressable>
        <View style={boxStyles}>
          <Text style={titleStyles}>{i18n.t('earnScreen.transfer.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.transfer.description')}
          </Text>
        </View>
        <View style={boxStyles}>
          <Text style={titleStyles}>{i18n.t('earnScreen.create.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.create.description')}
          </Text>
        </View>
        <View style={boxStyles}>
          <Text style={titleStyles}>{i18n.t('earnScreen.curate.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.curate.description')}
          </Text>
        </View>
        <View style={boxStyles}>
          <Text style={titleStyles}>{i18n.t('earnScreen.develop.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.develop.description')}
          </Text>
        </View>
        <View style={boxStyles}>
          <Text style={titleStyles}>{i18n.t('earnScreen.refer.title')}</Text>
          <Text style={descriptionStyles}>
            {i18n.t('earnScreen.refer.description')}
          </Text>
        </View>
      </ScrollView>
      <UniswapWidget
        isVisible={showUniswapWidget}
        action={'add'}
        onCloseButtonPress={toggleUniswapWidget}
      />
    </>
  );
}
