//@ts-nocheck
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

import { LICENSES, getLicenseText } from '../services/list-options.service';
import ModalPicker from './ModalPicker';
import MText from './MText';

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
  licenseSelected = value => {
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
    const theme = ThemedStyles.styles;

    const iconColor =
      this.props.iconColor || ThemedStyles.getColor('PrimaryText');

    return (
      <View style={[theme.rowJustifyCenter, theme.alignCenter]}>
        <MText style={[theme.fontXS, theme.colorMedium, theme.paddingRight]}>
          {text}
        </MText>
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
