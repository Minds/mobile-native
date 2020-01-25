import React, { Component } from 'react';
import {TextInput, Text, View, StyleSheet, TouchableOpacity, Modal, TouchableHighlight, Alert} from 'react-native';
import { ComponentsStyle } from '../../styles/Components';
import i18n from '../services/i18n.service';
import { CommonStyle as CS } from '../../styles/Common';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneInput from 'react-native-phone-input';
import DateTimePicker from 'react-native-modal-datetime-picker';
import InfoPopup from './InfoPopup';
import PhoneValidationComponent from './PhoneValidationComponent';

export default class Input extends Component {

  state = {
    datePickerVisible: false,
  };

  showDatePicker = () => {
    this.setState({datePickerVisible: true});
  };

  dismissDatePicker = () => {
    this.setState({datePickerVisible: false});
  };

  confirmDatePicker = date => {
    this.props.onChangeText(date.toLocaleDateString());
    this.dismissDatePicker();
  };

  textInput = () => {
    return (
      <TextInput
        {...this.props}
        style={[ComponentsStyle.loginInputNew, this.props.style]}
        placeholderTextColor="#444"
        returnKeyType={'done'}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        placeholder=''
      />
    );
  }
  
  phoneInput = () => {
    return (
      <PhoneValidationComponent 
        style={[ComponentsStyle.loginInputNew, this.props.style]}
        textStyle={{color: '#FFFFFF'}}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }

  dateInput = () => {
    return (
      <View>
      <TouchableOpacity
        {...this.props}
        style={[ComponentsStyle.loginInputNew, this.props.style]}
        placeholderTextColor="#444"
        returnKeyType={'done'}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        placeholder=''
        onPress={this.showDatePicker}
      >
        <Text style={CS.colorPrimaryText}>{this.props.value}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={this.state.datePickerVisible}
        onConfirm={this.confirmDatePicker}
        date={new Date()}
        onCancel={this.dismissDatePicker}
        mode='date'
      />
      </View>
    );
  };

  renderInput = () => {
    const inputType = this.props.inputType;
    if (inputType) {
      switch(inputType) {
        case 'textInput':
          return this.textInput();
        case 'phoneInput':
          return this.phoneInput();
        case 'dateInput':
          return this.dateInput();
      }
    }
    return this.textInput();
  };

  render() {
    const optional = (<Text style={[styles.optional]}>{"Optional"}</Text>);

    return (
      <View style={[CS.flexContainer, CS.marginBottom2x]}>
        <View style={[styles.row, CS.marginBottom]}>
          <View style={styles.row}>
            <Text style={[styles.label]}>{this.props.placeholder}</Text>
            {this.props.info && <InfoPopup info={this.props.info} />}
          </View>
          {this.props.optional && optional}
        </View>
        {this.renderInput()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#AEB0B8',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  optional: {
    color: '#AEB0B8',
    fontSize: 14,
    fontFamily: 'Roboto-Italic',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});
