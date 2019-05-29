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
import i18n from '../../common/services/i18n.service';

/**
 * Type Selector
 */
export default class TypeSelector extends PureComponent {
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
   * @param {string} type
   * @param {string} title
   * @param {string} subtitle
   * @param {Text} selected
   */
  getOption(type, title, subtitle, selected) {
    const isSelected = this.props.value === type,
      colorStyle = isSelected ? CommonStyle.colorDark : CommonStyle.colorMedium;

    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.paddingRight]} onPress={() => this.change(type)}>
        <View>
          <Text style={[CommonStyle.fontXL, colorStyle]}>{title}</Text>
          <Text style={[CommonStyle.fontXS, colorStyle]}>{subtitle}</Text>
          {isSelected && selected}
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * Render
   */
  render() {
    const selected = <Text style={[CommonStyle.fontS, CommonStyle.colorPrimary]}>{i18n.t('boosts.selected')}</Text>,
      NewsfeedPartial = this.getOption('newsfeed', i18n.t('boosts.feeds'), i18n.t('boosts.feedsDescription'), selected),
      P2pPartial = this.getOption('p2p', i18n.t('boosts.offers'), i18n.t('boosts.offersDescription'), selected),
      ContentPartial = this.getOption('content',  i18n.t('boosts.sidebars'), i18n.t('boosts.sidebarsDescription'), selected),
      allowedTypes = this.props.allowedTypes;

    return (
      <View style={CommonStyle.rowJustifyStart}>
        {allowedTypes.newsfeed && NewsfeedPartial}
        {allowedTypes.p2p && P2pPartial}
        {allowedTypes.content && ContentPartial}
      </View>
    )
  }
}
