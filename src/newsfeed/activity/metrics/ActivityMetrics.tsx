import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CommonStyle } from '../../../styles/Common';
import abbrev from '../../../common/helpers/abbrev';
import token from '../../../common/helpers/token';
import number from '../../../common/helpers/number';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from 'src/newsfeed/ActivityModel';

type PropsType = {
  entity: ActivityModel;
};

/**
 * Activity metrics component
 */
@observer
export default class ActivityMetrics extends Component<PropsType> {
  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    if (!entity.wire_totals) {
      return <View />;
    }

    return (
      <View style={[CommonStyle.rowJustifyCenter]}>
        <View
          style={[
            CommonStyle.rowJustifyStart,
            CommonStyle.borderRadius4x,
            CommonStyle.border,
            CommonStyle.borderHair,
            CommonStyle.borderGreyed,
            CommonStyle.paddingLeft,
            CommonStyle.paddingRight,
            ThemedStyles.style.backgroundTertiary,
            styles.container,
          ]}>
          <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
            <Text style={styles.counter}>
              {abbrev(token(entity.wire_totals.tokens), 0)}{' '}
              <Icon name="ios-flash" />
            </Text>
          </View>
          <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
            <Text style={[styles.counter]}> · </Text>
            <Text style={styles.counter}>
              {number(entity.impressions, 0)} <McIcon name="eye" />
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  counter: {
    alignItems: 'center',
    fontSize: 11,
  },
  container: {
    paddingVertical: 2,
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
