import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import i18n from '../../../common/services/i18n.service';

/**
 * List row
 */
export default class ContributionRow extends PureComponent {

  state = {
    selected: false
  }

  /**
   * Render
   */
  render() {
    const item = this.props.item;
    const selected = this.state.selected;

    const color = selected ? [CommonStyle.colorBlack, {fontWeight: '800'}] : [CommonStyle.colorDark];

    const detail = selected ? this.getDetail() : null;

    return (
      <View>
      <TouchableOpacity style={styles.row} onPress={this.toggle}>
        <View style={CommonStyle.rowJustifyStart}>
          <Text style={[...color,  CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{i18n.l('date.formats.small', item.timestamp)}</Text>
          <Text style={[...color, CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{item.score}</Text>
          <Text style={[...color, CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{item.share.toFixed(6)}%</Text>
        </View>
      </TouchableOpacity>
      {detail}
      </View>
    )
  }

  /**
   * Get row detail
   */
  getDetail() {
    detail = [];

    const metrics = this.props.item.metrics;

    Object.keys(metrics).forEach((key) => {
      let data = metrics[key];

      const share = data.score/this.props.item.score * this.props.item.share;

      detail.push(
        <View style={styles.row}>
          <View style={CommonStyle.rowJustifyStart}>
            <Text style={[CommonStyle.colorPrimary,  CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{data.metric[0].toUpperCase() + data.metric.slice(1)}</Text>
            <Text style={[CommonStyle.colorPrimary, CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{data.score}</Text>
            <Text style={[CommonStyle.colorPrimary, CommonStyle.fontS, CommonStyle.flexContainer, CommonStyle.textCenter, styles.column]}>{share.toFixed(6)}%</Text>
          </View>
        </View>
      )
    });

    return detail;
  }

  /**
   * Toggle row details
   */
  toggle = () => {
    this.setState({selected: !this.state.selected});
  }
}

const styles = StyleSheet.create({
  row: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
});
