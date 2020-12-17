import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';
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

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          theme.rowJustifySpaceBetween,
          theme.padding6x,
          styles.container,
        ]}>
        <Pressable
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}
          onPress={toggleUniswapWidget}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.pool.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
            {i18n.t('earnScreen.pool.description')}
          </Text>
        </Pressable>
        <View
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.transfer.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
            {i18n.t('earnScreen.transfer.description')}
          </Text>
        </View>
        <View
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.create.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
            {i18n.t('earnScreen.create.description')}
          </Text>
        </View>
        <View
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.curate.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
            {i18n.t('earnScreen.curate.description')}
          </Text>
        </View>
        <View
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.develop.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
            {i18n.t('earnScreen.develop.description')}
          </Text>
        </View>
        <View
          style={[
            theme.border,
            theme.borderBackgroundTertiary,
            theme.padding6x,
            theme.marginBottom3x,
          ]}>
          <Text style={[theme.fontXXL, theme.bold, theme.marginBottom2x]}>
            {i18n.t('earnScreen.refer.title')}
          </Text>
          <Text style={[theme.fontL, theme.colorSecondaryText]}>
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
