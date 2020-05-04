//@ts-nocheck
import React, { Component } from 'react';

import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

import { observer } from 'mobx-react';

import { Icon } from 'react-native-elements';
import Counter from '../newsfeed/activity/actions/Counter';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

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
    const color = entity.replies_count
      ? 'rgb(70, 144, 214)'
      : 'rgb(96, 125, 139)';
    const textStyle = { color };

    const CS = ThemedStyles.style;

    return (
      <TouchableOpacityCustom
        style={[
          CS.flexContainer,
          CS.centered,
          CS.paddingRight2x,
          this.props.orientation == 'column'
            ? CS.columnAlignCenter
            : CS.rowJustifyCenter,
        ]}
        onPress={this.toggleExpand}
        testID="ReplyCommentButton">
        <Icon color={color} name={this.iconName} size={this.props.size} />
        <Text style={[textStyle, CS.marginRight]}>{i18n.t('reply')}</Text>
        <Counter
          size={this.props.size * 0.75}
          count={entity.replies_count}
          orientation={this.props.orientation}
        />
      </TouchableOpacityCustom>
    );
  }

  /**
   * Toggle thumb
   */
  toggleExpand = () => {
    this.props.toggleExpand();
  };
}
