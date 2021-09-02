import React, { PureComponent } from 'react';

import { View, TouchableHighlight } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';
import ActivityModel from '../../../newsfeed/ActivityModel';
import { actionsContainerStyle } from './styles';
import PressableScale from '../../../common/components/PressableScale';

// prevent double tap in touchable
const PressableCustom = withPreventDoubleTap(PressableScale);

type PropsType = {
  navigation: any;
  entity: ActivityModel;
};

/**
 * Boost Action Component
 */
export default class BoostAction extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <View>
        <PressableCustom
          style={actionsContainerStyle}
          underlayColor="transparent"
          onPress={this.openBoost}>
          <View style={iconContainer}>
            <Icon
              name="trending-up"
              style={theme.colorSecondaryText}
              size={21}
            />
          </View>
        </PressableCustom>
      </View>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    this.props.navigation.push('BoostPostScreen', {
      entity: this.props.entity,
    });
  };
}

const iconContainer = ThemedStyles.combine('rowJustifyStart', 'centered');
