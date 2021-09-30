//@ts-nocheck
import React, { Component } from 'react';

import { View } from 'react-native';

import i18n from '../../common/services/i18n.service';
import StripeCardSelector from '../../wire/methods/StripeCardSelector';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';

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
        ]}
      >
        <MText
          style={[
            theme.marginTop2x,
            theme.fontHairline,
            theme.fontXL,
            theme.marginBottom2x,
          ]}
        >
          {i18n.t('wire.selectCredit')}
        </MText>
        <StripeCardSelector onCardSelected={this.onSelectCard} />
      </View>
    );
  }
}
