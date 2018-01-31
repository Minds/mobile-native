import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';

import { CommonStyle } from '../../../styles/Common';
import Counter from './Counter';

/**
 * Comments Action Component
 */
export default class CommentsAction extends PureComponent {

  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]} onPress={this.openComments}>
        <Icon color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='chat-bubble' size={20} />
        <Counter size={16} count={this.props.entity['comments:count']} />
      </TouchableOpacity>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    this.props.navigation.navigate('Comments', { entity: this.props.entity });
  }
}