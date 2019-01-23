import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import { Icon } from 'react-native-elements';
import { CommonStyle } from '../styles/Common';
import Counter from '../newsfeed/activity/actions/Counter';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Reply Action Component
 */
@observer
export default class ReplyAction extends Component {

  /**
   * Default Props
   */
  static defaultProps = {
    size: 20,
  };

  /**
   * Action Icon
   */
  iconName = 'reply';

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const color = entity.replies_count ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)';
    const textStyle = {color};

    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.centered, CommonStyle.paddingRight2x, this.props.orientation == 'column' ? CommonStyle.columnAlignCenter : CommonStyle.rowJustifyCenter ]} onPress={this.toggleExpand}>
        <Icon color={color} name={this.iconName} size={this.props.size} />
        <Text style={textStyle}>Reply</Text>
        <Counter size={this.props.size * 0.75} count={entity.replies_count} orientation={this.props.orientation}/>
      </TouchableOpacityCustom>
    );
  }

  /**
   * Toggle thumb
   */
  toggleExpand = () => {
    this.props.toggleExpand();
  }
}
