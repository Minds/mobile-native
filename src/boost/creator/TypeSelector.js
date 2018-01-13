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
export default class TypeSelector extends PureComponent {

  state = {
    selected: 'feeds'
  }

  /**
   * change option
   * @param {string} selected
   */
  change(selected) {
    if (this.state.selected != selected) {
      this.setState({selected});
      this.props.onChange(selected);
    }
  }

  /**
   * Get Option component
   * @param {string} title
   * @param {string} subtitle
   * @param {Text} selected
   */
  getOption(title, subtitle, selected) {
    const isSelected = this.state.selected == title;
    const colorStlye = isSelected ? CommonStyle.colorDark : CommonStyle.colorMedium;
    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.paddingRight]} onPress={() => this.change(title)}>
        <View>
          <Text style={[CommonStyle.fontXL, colorStlye]}>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
          <Text style={[CommonStyle.fontXS, colorStlye]}>{subtitle}</Text>
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
    const feeds = this.getOption('feeds', 'Your content will appear on newsfeeds across the site.', selected);
    const channels = this.getOption('channels', 'Your content will be shared to a specific channel in exchange for USD, tokens or points.', selected);

    return (
      <View style={CommonStyle.rowJustifyStart}>
        {feeds}
        {channels}
      </View>
    )
  }
}