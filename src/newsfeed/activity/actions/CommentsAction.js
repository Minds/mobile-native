import React, {
  Component
} from 'react';

import { observer, inject } from 'mobx-react/native';

import {
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_CREATE_COMMENT } from '../../../common/Permissions';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Comments Action Component
 */
export default
@observer
class CommentsAction extends Component {

  static defaultProps = {
    size: 20,
  };
  /**
   * Render
   */
  render() {
    const icon = this.props.entity.allow_comments ? 'chat-bubble' : 'speaker-notes-off';

    const canComment = this.props.entity.allow_comments && this.props.entity.can(FLAG_CREATE_COMMENT);

    const color = canComment ? (this.props.entity['comments:count'] > 0 ? CS.colorPrimary : CS.colorAction) : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom style={[CS.flexContainer, CS.centered, CS.rowJustifyCenter]} onPress={this.openComments} testID={this.props.testID}>
        <Icon style={[color, CS.marginRight]} name={icon} size={this.props.size} />
        <Counter size={this.props.size * 0.70} count={this.props.entity['comments:count']} />
      </TouchableOpacityCustom>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    const cantOpen = !this.props.entity.allow_comments && this.props.entity['comments:count'] == 0;
    // TODO: fix
    if (this.props.navigation.state.routeName == 'Activity' || cantOpen) {
      return;
    }
    this.props.navigation.push('Activity', {
      entity: this.props.entity,
      scrollToBottom: true,
    });
  }
}