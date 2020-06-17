import React, { PureComponent } from 'react';

import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import ActivityModel from '../../../newsfeed/ActivityModel';

// prevent double tap in touchable
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);

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
        <TouchableHighlightCustom
          style={[
            theme.rowJustifyCenter,
            theme.paddingHorizontal3x,
            theme.paddingVertical4x,
            theme.alignCenter,
          ]}
          underlayColor="transparent"
          onPress={this.openBoost}>
          <Text
            style={[styles.text, theme.colorIconActive]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {i18n.t('boost').toUpperCase()}
          </Text>
        </TouchableHighlightCustom>
      </View>
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    this.props.navigation.push('Boost', { entity: this.props.entity });
  };
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto',
    fontSize: 15,
    textAlignVertical: 'center',
    lineHeight: 21,
    letterSpacing: 1,
  },
});
