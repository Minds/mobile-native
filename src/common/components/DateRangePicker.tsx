import React, {
  PureComponent
} from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import { CommonStyle } from '../../styles/Common';

import i18n from '../../common/services/i18n.service';

/**
 * Date range picker
 */
export default class DateRangePicker extends PureComponent {

  /**
   * Default props
   */
  static defaultProps = {
    to: new Date(),
    from: new Date()
  };

  /**
   * Prop types
   */
  static propTypes = {
    onToChange: PropTypes.func.isRequired,
    onFromChange: PropTypes.func.isRequired,
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this.setState({
      fromVisible: false,
      toVisible: false
    });
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.padding, CommonStyle.rowJustifyCenter]}>
        <TouchableOpacity onPress={this.showFrom}>
          <Text style={CommonStyle.fontS}>FROM: <Text style={[CommonStyle.colorPrimary, CommonStyle.fontL]}>{i18n.l('date.formats.small', this.props.from)}</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.showTo} style={CommonStyle.paddingLeft2x}>
          <Text style={CommonStyle.fontS}>TO: <Text style={[CommonStyle.colorPrimary, CommonStyle.fontL]}>{i18n.l('date.formats.small', this.props.to)}</Text></Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.fromVisible}
          onConfirm={this.setFrom}
          date={this.props.from}
          onCancel={this.hideFrom}
        />
        <DateTimePicker
          isVisible={this.state.toVisible}
          onConfirm={this.setTo}
          date={this.props.to}
          onCancel={this.hideTo}
        />
      </View>
    )
  }

  /**
   * Show to picker
   */
  showTo = () => {
    this.setState({ toVisible: true });
  }

  /**
   * Show from picker
   */
  showFrom = () => {
    this.setState({ fromVisible: true });
  }

  /**
   * Hide to picker
   */
  hideTo = () => {
    this.setState({ toVisible: false });
  }

  /**
   * Hide from picker
   */
  hideFrom = () => {
    this.setState({ fromVisible: false });
  }

  /**
   * Fire when to change
   */
  setTo = (value) => {
    this.hideTo();
    this.props.onToChange(value);
  }

  /**
   * Fire when from change
   */
  setFrom = (value) => {
    this.hideFrom();
    this.props.onFromChange(value);
  }
}
