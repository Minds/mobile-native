import React, { PureComponent } from 'react';
import {
  Picker,
  View,
  Text,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import Button from '../../common/components/Button';
import i18nService from '../services/i18n.service';

const height = Platform.OS === 'ios' ? 300 : 150;

/**
 * Modal picker component
 */
export default class ModalPicker extends PureComponent {

  state = {
    show:false,
    current: '',
    value: null
  }

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {

    if (prevState.value !== nextProps.value && prevState.current !== nextProps.value) {
      return {
        current: nextProps.value,
        value: nextProps.value
      }
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.setState({value: this.props.value});
    }
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
    if (this.props.onSelect) this.props.onSelect(this.state.value);
  }

  /**
   * Cancel
   */
  cancel = () => {
    this.setState({
      value: this.state.current
    });
    if (this.props.onCancel) this.props.onCancel();
  }

  /**
   * Render
   */
  render() {
    const {
      title,
      labelField,
      valueField,
      items,
      props
    } = this.props;

    return (
      <Modal isVisible={this.props.show}>
        <View style={[CommonStyle.backgroundWhite, { height, paddingBottom: 8 }]}>
          <Text style={[CommonStyle.fontL, CommonStyle.textCenter, CommonStyle.backgroundPrimary, CommonStyle.padding2x, CommonStyle.colorWhite]}>{title}</Text>
          <View style={[CommonStyle.flexContainer]}>
            <Picker {...props} onValueChange={this.select} selectedValue={this.state.value} style={{flex:1}} itemStyle={CommonStyle.fontM}>
              {items.map((item, i) => <Picker.Item key={i} label={item[labelField]} value={item[valueField]} /> )}
            </Picker>
            <View style={[CommonStyle.rowJustifyCenter]}>
              <Button text={i18nService.t('cancel')} onPress={this.cancel} color={colors.darkGreyed}/>
              <Button text={i18nService.t('ok')} onPress={this.ok}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}