import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommonStyle } from '../../../styles/Common';

import abbrev from '../../../common/helpers/abbrev';
import token from '../../../common/helpers/token';

/**
 * Activity metrics component
 */
@inject("user")
@observer
export default class ActivityMetrics extends Component {

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

    const edited = entity.edited ? <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
      <Text style={[styles.counter]}> · </Text>
      <Text style={styles.counter}>EDITED</Text>
    </View> : null

    return (
      <View style={[CommonStyle.rowJustifyCenter]}>
        {this.showCounter(token(entity.wire_totals.tokens), 'TKN')}
        {this.showCounter(entity.impressions, 'VIEWS')}
        {edited}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  counter: {
    color: '#777',
    fontSize: 11,
  },
})
