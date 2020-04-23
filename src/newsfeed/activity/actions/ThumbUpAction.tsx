import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';
import { FLAG_VOTE } from '../../../common/Permissions';
import remoteAction from '../../../common/RemoteAction';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  size: number;
  orientation: 'column' | 'row';
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
    size: 20,
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

    //@ts-ignore
    const count = entity[`thumbs:${this.direction}:count`];

    const canVote = entity.can(FLAG_VOTE);

    const color = canVote
      ? this.voted
        ? ThemedStyles.style.colorIconActive
        : ThemedStyles.style.colorIcon
      : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom
        style={[
          CS.flexContainer,
          CS.centered,
          this.props.orientation === 'column'
            ? CS.columnAlignCenter
            : CS.rowJustifyCenter,
        ]}
        onPress={this.toggleThumb}
        {...testID(`Thumb ${this.direction} activity button`)}>
        <Icon
          style={[color, CS.marginRight]}
          name={this.iconName}
          size={this.props.size}
        />
        <Counter
          size={this.props.size * 0.7}
          count={count}
          testID={`Thumb ${this.direction} count`}
        />
      </TouchableOpacityCustom>
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
