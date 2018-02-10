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

/**
 * Activity metrics component
 */
@inject("user")
export default class ActivityMetrics extends PureComponent {

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const isOwner = this.props.user.me.guid == entity.owner_guid;
    return (
    <View style={[styles.container, isOwner ? styles.ownerContainer : null ]}>
      <View style={[CommonStyle.rowJustifyCenter]}>
        <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
          <McIcon name="bank" size={8} style={ styles.icon }/>
          <Text style={styles.counter}>{entity.wire_totals.tokens}</Text>
        </View>
        <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter, CommonStyle.paddingLeft]}>
          <McIcon name="eye" size={8} style={ styles.icon }/>
          <Text style={styles.counter}>{entity.impressions}</Text>
        </View>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    borderColor: '#ececec',
    backgroundColor: '#FFF',
    //width: 80,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'center'
  },
  ownerContainer: {
    alignSelf: 'flex-end',
    right: 8,
  },
  icon: {
    marginTop: 1,
    color: '#777',
  },
  counter: {
    color: '#777',
    fontSize: 8,
    marginLeft: 4,
  }
})