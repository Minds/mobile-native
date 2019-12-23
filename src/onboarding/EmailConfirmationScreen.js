import React, {Component} from 'react';

import {View, Text} from 'react-native';
import { CommonStyle } from '../styles/Common';

/**
 * Email confirmation screen
 */
export default class EmailConfirmationScreen extends Component {
  /**
   * Component did mount
   */
  componentDidMount() {
    // TODO: Implement call to the api for confirmation using the deeplinks params (this.props.navigation.state.params)
    console.log('ConfirmParams', this.props.navigation.state.params);
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <Text style={CommonStyle.fontL}>Sending email confirmation</Text>
      </View>
    );
  }
}
