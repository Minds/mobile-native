import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import { CommonStyle } from '../../styles/Common';

/**
 * Type Selector
 */
export default class PaymentSelector extends PureComponent {

  state = {
    selected: 'USD'
  }

  /**
   * change option
   * @param {string} selected
   */
  change(selected) {
    if (this.state.selected != selected) {
      this.setState({ selected });
      this.props.onChange(selected);
    }
  }

  /**
   * Get Option component
   * @param {string} text
   * @param {string} value
   * @param {Text} selected
   */
  getOption(text, value, selected) {
    const isSelected = this.state.selected == text;
    const colorStlye = isSelected ? CommonStyle.colorDark : CommonStyle.colorMedium;
    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.paddingRight]} onPress={() => this.change(text)}>
        <View>
          <Text style={[CommonStyle.fontXL, colorStlye]}>{value}</Text>
          <Text style={[CommonStyle.fontXS, colorStlye]}>{text}</Text>
          {isSelected && selected}
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * Render
   */
  render() {
    const selected = <Text style={[CommonStyle.fontS, CommonStyle.colorPrimary]}>SELECTED</Text>;
    const usd = this.getOption('USD', this.props.valueUsd, selected);
    const rewards = this.getOption('REWARDS', this.props.valueRewards, selected);
    const tokens = this.getOption('TOKENS', this.props.valueTokens, selected);

    return (
      <View style={CommonStyle.rowJustifyStart}>
        {usd}
        {rewards}
        {tokens}
      </View>
    )
  }
}