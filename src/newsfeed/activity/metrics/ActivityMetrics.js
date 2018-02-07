import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommonStyle } from '../../../styles/Common';

/**
 * Activity metrics component
 */
export default class ActivityMetrics extends PureComponent {

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    return (
    <View style={styles.metricsContainer}>
      <View style={[CommonStyle.rowJustifyCenter]}>
        <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
          <McIcon name="bank" size={10} />
          <Text style={[CommonStyle.fontXS, CommonStyle.paddingLeft]}>{entity.wire_totals.tokens}</Text>
        </View>
        <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter, CommonStyle.paddingLeft2x]}>
          <McIcon name="eye" size={10} />
          <Text style={[CommonStyle.fontXS, CommonStyle.paddingLeft]}>{entity.impressions}</Text>
        </View>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  metricsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: '#CCC',
    width: 80,
    alignSelf: 'center'
  }
})