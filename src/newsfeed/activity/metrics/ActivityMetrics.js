import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  inject,
} from 'mobx-react/native'

import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommonStyle } from '../../../styles/Common';

import abbrev from '../../../common/helpers/abbrev';

/**
 * Activity metrics component
 */
@inject("user")
export default class ActivityMetrics extends PureComponent {

  showCounter(value, label) {
    return value > 0 ?
      <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
        <Text style={[styles.counter]}> · </Text>
        <Text style={styles.counter}>{abbrev(value,0)}</Text>
        <Text style={styles.counter}>{label} </Text>
      </View> : null;
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    if (!entity.wire_totals) {
      return <View />;
    }

    const isOwner = this.props.user.me.guid == entity.owner_guid;

    return (
      <View style={[CommonStyle.rowJustifyCenter]}>
        {this.showCounter(entity.wire_totals.tokens, 'TOKENS')}
        {this.showCounter(entity.impressions, 'VIEWS')}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  counter: {
    color: '#777',
    fontSize: 11,
    marginLeft: 4,
  },
})
