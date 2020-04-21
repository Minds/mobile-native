//@ts-nocheck
import React, { PureComponent } from 'react';
import { Picker, View, Text, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

import { LICENSES, getLicenseText } from '../services/list-options.service';
import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import ModalPicker from './ModalPicker';

/**
 * License picker component
 */
export default class LicensePicker extends PureComponent {
  state = {
    show: false,
    current: 'all-rights-reserved',
  };

  /**
   * Toggle modal
   */
  toggle = (current = null) => {
    this.setState({
      show: !this.state.show,
      current,
    });
  };

  /**
   * Show selection
   */
  licenseSelected = (value) => {
    this.toggle(value);
    this.props.onLicenseSelected(value);
  };

  /**
   * Cancel
   */
  cancel = () => {
    this.toggle();
  };

  /**
   * Render
   */
  render() {
    const text = getLicenseText(this.state.current);

    const iconColor = this.props.iconColor || colors.darkGreyed;

    return (
      <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
        <Text
          style={[
            CommonStyle.fontXS,
            CommonStyle.colorMedium,
            CommonStyle.paddingRight,
          ]}>
          {text}
        </Text>
        <Icon name="copyright" color={iconColor} onPress={this.toggle} />
        <ModalPicker
          onSelect={this.licenseSelected}
          onCancel={this.cancel}
          show={this.state.show}
          title="Select License"
          valueField="value"
          labelField="text"
          value={this.props.value}
          items={LICENSES}
        />
      </View>
    );
  }
}
