//@ts-nocheck
import React, { Component } from 'react';

import { View, Text } from 'react-native';

import i18n from '../../common/services/i18n.service';
import StripeCardSelector from '../../wire/methods/StripeCardSelector';
import ThemedStyles from '../../styles/ThemedStyles';

export default class BillingScreen extends Component {
  onSelectCard = card => {
    return;
  };

  render() {
    const theme = ThemedStyles.style;
    return (
      <View
        style={[
          theme.columnAlignCenter,
          theme.bgSecondaryBackground,
          theme.borderTop,
          theme.borderBottom,
          theme.bcolorPrimaryBorder,
          theme.paddingBottom3x,
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
