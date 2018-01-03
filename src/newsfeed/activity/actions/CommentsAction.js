import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';

import { Icon } from 'react-native-elements';

import { CommonStyle } from '../../../styles/Common';

/**
 * Comments Action Component
 */
export default class CommentsAction extends PureComponent {

  /**
   * Render
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <Icon style={styles.actionIcon} color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='chat-bubble' size={20} onPress={this.openComments} />
        <Text style={styles.actionIconText}>{this.props.entity['comments:count'] > 0 ? this.props.entity['comments:count'] : ''}</Text>
      </View>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    this.props.navigation.navigate('Comments', { entity: this.props.entity });
  }
}

const styles = StyleSheet.create({
  actionIconText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 52,
    alignContent: 'center',
    justifyContent: 'center'
  }
});