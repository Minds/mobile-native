import React, { Component } from 'react';

import { Text, TouchableOpacity, Platform } from 'react-native';

import { observer } from 'mobx-react';

import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import { TouchableOpacity as TouchableGesture } from 'react-native-gesture-handler';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(
  // @ts-ignore
  Platform.OS === 'ios' ? TouchableOpacity : TouchableGesture,
);

/**
 * Reply Action Component
 */
@observer
export default class ReplyAction extends Component<{
  onPressReply: () => void;
}> {
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
    return (
      <TouchableOpacityCustom
        style={containerStyle}
        onPress={this.toggleExpand}
        testID="ReplyCommentButton">
        <Text style={fontStyle}>{i18n.t('reply')}</Text>
      </TouchableOpacityCustom>
    );
  }

  /**
   * Toggle thumb
   */
  toggleExpand = () => {
    this.props.onPressReply();
  };
}

const containerStyle = ThemedStyles.combine(
  'paddingRight2x',
  'rowJustifyStart',
  'marginLeft3x',
);

const fontStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'marginRight',
  'fontMedium',
);
