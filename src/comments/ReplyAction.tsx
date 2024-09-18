import React, { Component } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { TouchableOpacity as TouchableGesture } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';

import withPreventDoubleTap from '~/common/components/PreventDoubleTap';

import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';
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
        <MText style={fontStyle}>{sp.i18n.t('reply')}</MText>
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

const containerStyle = sp.styles.combine(
  'paddingRight2x',
  'rowJustifyStart',
  'marginLeft3x',
);

const fontStyle = sp.styles.combine(
  'colorPrimaryText',
  'marginRight',
  'fontMedium',
);
