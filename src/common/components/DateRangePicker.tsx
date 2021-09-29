//@ts-nocheck
import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';

/**
 * Date range picker
 */
export default class DateRangePicker extends PureComponent {
  /**
   * Default props
   */
  static defaultProps = {
    to: new Date(),
    from: new Date(),
  };

  state = {
    fromVisible: false,
    toVisible: false,
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <View style={[theme.padding, theme.rowJustifyCenter]}>
        <TouchableOpacity onPress={this.showFrom}>
          <MText style={theme.fontS}>
            FROM:{' '}
            <MText style={[theme.colorPrimary, theme.fontL]}>
              {i18n.l('date.formats.small', this.props.from)}
            </MText>
          </MText>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.showTo} style={theme.paddingLeft2x}>
          <MText style={theme.fontS}>
            TO:{' '}
            <MText style={[theme.colorPrimary, theme.fontL]}>
              {i18n.l('date.formats.small', this.props.to)}
            </MText>
          </MText>
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
    );
  }

  /**
   * Show to picker
   */
  showTo = () => {
    this.setState({ toVisible: true });
  };

  /**
   * Show from picker
   */
  showFrom = () => {
    this.setState({ fromVisible: true });
  };

  /**
   * Hide to picker
   */
  hideTo = () => {
    this.setState({ toVisible: false });
  };

  /**
   * Hide from picker
   */
  hideFrom = () => {
    this.setState({ fromVisible: false });
  };

  /**
   * Fire when to change
   */
  setTo = value => {
    this.hideTo();
    this.props.onToChange(value);
  };

  /**
   * Fire when from change
   */
  setFrom = value => {
    this.hideFrom();
    this.props.onFromChange(value);
  };
}
