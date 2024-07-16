import React, { Component } from 'react';

import { View } from 'react-native';

import StripeCardSelector from '~/common/components/stripe-card-selector/StripeCardSelector';

import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

export default class BillingScreen extends Component {
  onSelectCard = _ => {
    return;
  };

  render() {
    const theme = sp.styles.style;
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
        <MText
          style={[
            theme.marginTop2x,
            theme.fontHairline,
            theme.fontXL,
            theme.marginBottom2x,
          ]}>
          {sp.i18n.t('wire.selectCredit')}
        </MText>
        <StripeCardSelector onCardSelected={this.onSelectCard} />
      </View>
    );
  }
}
