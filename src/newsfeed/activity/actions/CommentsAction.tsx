import React, { Component } from 'react';

import { observer } from 'mobx-react';

import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_CREATE_COMMENT } from '../../../common/Permissions';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel | BlogModel;
  testID?: string;
  size: number;
  navigation: any;
  onPressComment?: () => void;
};

/**
 * Comments Action Component
 */
@observer
class CommentsAction extends Component<PropsType> {
  static defaultProps = {
    size: 21,
  };
  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const icon = this.props.entity.allow_comments
      ? 'chat-bubble'
      : 'speaker-notes-off';

    // const color = canComment
    //   ? this.props.entity['comments:count'] > 0
    //     ? ThemedStyles.style.colorIconActive
    //     : ThemedStyles.style.colorIcon
    //   : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom
        style={[
          theme.rowJustifyCenter,
          theme.paddingHorizontal3x,
          theme.paddingVertical4x,
          theme.alignCenter,
        ]}
        onPress={this.openComments}
        testID={this.props.testID}>
        <Icon
          style={[theme.colorIcon, CS.marginRight]}
          name={icon}
          size={this.props.size}
        />
        <Counter count={this.props.entity['comments:count']} />
      </TouchableOpacityCustom>
    );
  }

  /**
   * Open comments screen
   */
  openComments = () => {
    if (this.props.onPressComment) {
      this.props.onPressComment();
      return;
    }
    const cantOpen =
      !this.props.entity.allow_comments &&
      this.props.entity['comments:count'] === 0;
    // TODO: fix
    const routes = this.props.navigation.dangerouslyGetState().routes;
    if ((routes && routes[routes.length - 1].name === 'Activity') || cantOpen) {
      return;
    }
    if (this.props.entity.subtype && this.props.entity.subtype === 'blog') {
      this.props.navigation.push('BlogView', {
        blog: this.props.entity,
        scrollToBottom: true,
      });
    } else {
      this.props.navigation.push('Activity', {
        entity: this.props.entity,
        scrollToBottom: true,
      });
    }
  };
}

export default CommentsAction;
