import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import { CommonStyle } from '../../styles/Common';
import currency from '../../common/helpers/currency';
import Touchable from '../../common/components/Touchable';
import FeaturesService from '../../common/services/features.service';
import i18n from '../../common/services/i18n.service';

/**
 * Type Selector
 */
export default class PaymentSelector extends PureComponent {
  /**
   * change option
   * @param {string} selected
   */
  change(selected) {
    if (selected !== this.props.value) {
      this.props.onChange(selected);
    }
  }

  /**
   * Get Option component
   * @param {string} method
   * @param {string} text
   * @param {string} value
   * @param {Text} selected
   */
  getOption(method, text, value, selected) {
    const isSelected = this.props.value === method;
    const colorStlye = isSelected ? CommonStyle.colorDark : CommonStyle.colorMedium;
    return (
      <Touchable style={[CommonStyle.flexContainer, CommonStyle.paddingRight]} onPress={() => this.change(method)}>
        <View>
          <Text style={[CommonStyle.fontXL, colorStlye]}>{currency(!isNaN(value) ? value : 0, method, 'prefix')}</Text>
          <Text style={[CommonStyle.fontXS, colorStlye]}>{text}</Text>
          {isSelected && false && selected}
        </View>
      </Touchable>
    )
  }

  /**
   * Render
   */
  render() {
    const selected = <Text style={[CommonStyle.fontS, CommonStyle.colorPrimary]}>{i18n.t('boosts.selected')}</Text>,
      usd = this.getOption('usd', i18n.t('usd'), this.props.values.usd, selected),
      tokens = this.getOption('tokens', i18n.t('tokens'), this.props.values.tokens, selected);

    return (
      <View style={CommonStyle.rowJustifyStart}>
        {this.props.type !== 'p2p' && false && usd}
        {FeaturesService.has('crypto') && tokens}
      </View>
    )
  }
}
