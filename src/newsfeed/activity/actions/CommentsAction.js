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
@observer
export default class CommentsAction extends Component {

  static defaultProps = {
    size: 20,
  };
  /**
   * Render
   */
  render() {
    const icon = this.props.entity.allow_comments ? 'chat-bubble' : 'speaker-notes-off';

    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]} onPress={this.openComments}>
        <Icon color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name={icon} size={this.props.size} />
        <Counter size={this.props.size * 0.75} count={this.props.entity['comments:count']} />
      </TouchableOpacityCustom>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    const cantOpen = !this.props.entity.allow_comments && this.props.entity['comments:count'] == 0;
    // TODO: fix
    if (this.props.navigation.state.routeName == 'Activity' || cantOpen){
      return;
    }
    this.props.navigation.push('Activity', {
      entity: this.props.entity,
      scrollToBottom: true,
    });
  }
}