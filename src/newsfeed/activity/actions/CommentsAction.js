import React, {
  Component
} from 'react';

import { observer, inject } from 'mobx-react/native';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';

import { CommonStyle } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Comments Action Component
 */
@inject('navigatorStore')
@observer
export default class CommentsAction extends Component {

  static defaultProps = {
    size: 20,
  };
  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]} onPress={this.openComments}>
        <Icon color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='chat-bubble' size={this.props.size} />
        <Counter size={this.props.size * 0.75} count={this.props.entity['comments:count']} />
      </TouchableOpacityCustom>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    if(this.props.navigatorStore.currentScreen == 'Activity' ){
      return;
    }
    this.props.navigation.navigate('Activity', { 
      entity: this.props.entity,
      scrollToBottom: true,
    });
  }
}