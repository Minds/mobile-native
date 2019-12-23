import React, { Component } from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';
import { ComponentsStyle } from '../../styles/Components';
import i18n from '../services/i18n.service';
import { CommonStyle } from '../../styles/Common';

export default class Input extends Component {
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.marginTop2x]}>
        <Text style={[styles.label, CommonStyle.marginBottom2x]}>{this.props.placeholder}</Text>
        <TextInput
          {...this.props}
          style={[ComponentsStyle.loginInputNew, this.props.style]}
          placeholderTextColor="#444"
          returnKeyType={'done'}
          autoCapitalize={'none'}
          underlineColorAndroid='transparent'
          placeholder=''
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: '#9B9B9B',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 20,
  },
});
