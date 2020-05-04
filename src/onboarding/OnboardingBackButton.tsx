//@ts-nocheck
import React, { Component } from 'react';

import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class OnboardingBackButton extends Component {
  render() {
    return (
      <View style={[{ alignSelf: 'flex-start' }]}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Icon size={34} name="keyboard-arrow-left" color="#777777" />
        </TouchableOpacity>
      </View>
    );
  }
}
