import React, { PureComponent } from 'react';
import { 
  Picker,
  View,
  Text,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal';

import { LICENSES, getLicenseText} from '../services/list-options.service';
import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import Button from '../../common/components/Button';

const height = Platform.OS === 'ios' ? 300 : 150;

/**
 * License picker component
 */
export default class LicensePicker extends PureComponent {

  state = {
    show: false,
    current: ''
  }

  /**
   * Derive state from props
   * @param {object} nextProps 
   * @param {object} prevState 
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      current: nextProps.value,
      value: nextProps.value
    }
  }

  /**
   * Toggle modal
   */
  toggle = () => {
    this.setState({
      show: !this.state.show
    });
  }

  /**
   * Update state on select
   */
  select = (value) => {
    this.setState({value})
  }

  /**
   * Show selection
   */
  ok = () => {
    this.toggle();
    this.props.onLicenseSelected(this.state.value)
  }

  /**
   * Cancel
   */
  cancel = () => {
    this.setState({
      value: this.state.current
    });
    this.toggle();
  }

  /**
   * Wrap in modal
   * @param {object} content 
   */
  modal(content) {
    return (
      <Modal isVisible={this.state.show}>
        <View style={[CommonStyle.backgroundWhite, { height, paddingBottom: 8 }]}>
          <Text style={[CommonStyle.fontL, CommonStyle.textCenter, CommonStyle.backgroundPrimary, CommonStyle.padding2x, CommonStyle.colorWhite]}>Chosse a license</Text>
          <View style={[CommonStyle.flexContainer]}>
            {content}
            <View style={[CommonStyle.rowJustifyCenter]}>
              <Button text='Cancel' onPress={this.cancel} color={colors.darkGreyed}/>
              <Button text='Ok' onPress={this.ok}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  /**
   * Render
   */
  render() {
    const modal = this.modal(this.renderPicker());

    const text = getLicenseText(this.state.current);

    const iconColor = this.props.iconColor || colors.darkGreyed
  
    return (
      <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignCenter]}>
        <Text style={[CommonStyle.fontXS, CommonStyle.colorMedium, CommonStyle.paddingRight]}>{text}</Text>
        <Icon name='copyright' color={iconColor} onPress={this.toggle}/>
        {modal}
      </View>
    )
  }
  
  /**
   * Render picker
   */
  renderPicker() {
    return (
      <Picker {...this.props} onValueChange={this.select} selectedValue={this.state.value} style={{flex:1}} itemStyle={CommonStyle.fontM}>
        {LICENSES.map((license, i) => <Picker.Item key={i} label={license.text} value={license.value} /> )}
      </Picker>
    );
  }
}