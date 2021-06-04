import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_VOTE } from '../../../common/Permissions';
import remoteAction from '../../../common/RemoteAction';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import {
  actionsContainerStyle,
  iconActiveStyle,
  iconDisabledStyle,
  iconNormalStyle,
} from './styles';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  size: number;
  hideCount?: boolean;
  orientation: 'column' | 'row';
  touchableComponent?: React.ComponentClass;
};

/**
 * Thumb Up Action Component
 */
@observer
class ThumbUpAction extends Component<PropsType> {
  /**
   * Default Props
   */
  static defaultProps = {
    size: 21,
    orientation: 'row',
  };

  /**
   * Thumb direction
   */
  direction: 'up' | 'down' = 'up';

  /**
   * Action Icon
   */
  iconName: string = 'thumb-up';

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    const count = entity[`thumbs:${this.direction}:count`];

    const canVote = entity.can(FLAG_VOTE);

    const iconStyle = canVote
      ? this.voted
        ? iconActiveStyle
        : iconNormalStyle
      : iconDisabledStyle;

    const Touchable = this.props.touchableComponent || TouchableOpacityCustom;

    return (
      <Touchable
        style={actionsContainerStyle}
        onPress={this.toggleThumb}
        testID={`Thumb ${this.direction} activity button`}>
        <Icon style={iconStyle} name={this.iconName} size={this.props.size} />
        {count && !this.props.hideCount ? (
          <Counter
            // size={this.props.size * 0.7}
            count={count}
            testID={`Thumb ${this.direction} count`}
          />
        ) : undefined}
      </Touchable>
    );
  }

  get voted() {
    return this.props.entity.votedUp;
  }

  /**
   * Toggle thumb
   */
  toggleThumb = async () => {
    if (!this.props.entity.can(FLAG_VOTE, true)) {
      return;
    }

    remoteAction(() => {
      return this.props.entity.toggleVote(this.direction);
    });
  };
}

export default ThumbUpAction;
