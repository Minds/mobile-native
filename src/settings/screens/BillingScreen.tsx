//@ts-nocheck
import React, { Component } from 'react';

import { View, StyleSheet, Text } from 'react-native';

import i18n from '../../common/services/i18n.service';
import StripeCardSelector from '../../wire/methods/StripeCardSelector';
import ThemedStyles from '../../styles/ThemedStyles';

export default class BillingScreen extends Component {
  onSelectCard = (card) => {
    return;
  };

  render() {
    const theme = ThemedStyles.style;
    return (
      <View
        style={[
          theme.columnAlignCenter,
          theme.backgroundSecondary,
          theme.borderTop,
          theme.borderBottom,
          theme.borderPrimary,
        ]}>
        <Text
          style={[
            theme.marginTop2x,
            theme.fontHairline,
            theme.fontXL,
            theme.marginBottom2x,
          ]}>
          {i18n.t('wire.selectCredit')}
        </Text>
        <StripeCardSelector onCardSelected={this.onSelectCard} />
      </View>
    );
  }
}
