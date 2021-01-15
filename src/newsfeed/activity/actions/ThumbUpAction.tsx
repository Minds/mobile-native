import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
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
import { TouchableOpacity } from '@gorhom/bottom-sheet';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  size: number;
  orientation: 'column' | 'row';
  containerStyle?: StyleProp<ViewStyle>;
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
    const theme = ThemedStyles.style;
    const entity = this.props.entity;

    const count = entity[`thumbs:${this.direction}:count`];

    const canVote = entity.can(FLAG_VOTE);

    const color = canVote
      ? this.voted
        ? theme.colorIconActive
        : theme.colorIcon
      : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom
        style={[
          theme.rowJustifyCenter,
          theme.paddingHorizontal3x,
          theme.paddingVertical4x,
          theme.alignCenter,
          this.props.containerStyle,
        ]}
        onPress={this.toggleThumb}
        {...testID(`Thumb ${this.direction} activity button`)}>
        <Icon
          style={[color, theme.marginRight]}
          name={this.iconName}
          size={this.props.size}
        />
        {count ? (
          <Counter
            // size={this.props.size * 0.7}
            count={count}
            testID={`Thumb ${this.direction} count`}
          />
        ) : undefined}
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
