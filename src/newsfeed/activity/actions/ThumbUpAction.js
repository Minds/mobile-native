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
import { CommonStyle } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Thumb Up Action Component
 */
@observer
export default class ThumbUpAction extends Component {

  /**
   * Default Props
   */
  static defaultProps = {
    size: 20,
  };

  /**
   * Thumb direction
   */
  direction = 'up';

  /**
   * Action Icon
   */
  iconName = 'thumb-up';

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    const count = entity[`thumbs:${this.direction}:count`];

    return (
      <TouchableOpacityCustom
        style={[CommonStyle.flexContainer, CommonStyle.centered, this.props.orientation == 'column' ? CommonStyle.columnAlignCenter : CommonStyle.rowJustifyCenter ]}
        onPress={this.toggleThumb}
        {...testID(`Thumb ${this.direction} activity button`)}
      >
        <Icon color={this.voted ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name={this.iconName} size={this.props.size} />
        <Counter size={this.props.size * 0.75} count={count} orientation={this.props.orientation} {...testID(`Thumb ${this.direction} count`)}/>
      </TouchableOpacityCustom>
    );
  }

  get voted() {
    return this.props.entity.votedUp;
  }

  /**
   * Toggle thumb
   */
  toggleThumb = () => {
    this.props.entity.toggleVote(this.direction);
  }
}
