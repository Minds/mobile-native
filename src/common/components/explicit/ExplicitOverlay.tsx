import React, { Component } from 'react';

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { observer } from 'mobx-react';
import { CommonStyle as CS } from '../../../styles/Common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GOOGLE_PLAY_STORE } from '../../../config/Config';
import i18n from '../../services/i18n.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';

type PropsType = {
  entity: ActivityModel;
  iconSize: number;
  hideText: boolean;
  iconPosition: 'right' | 'left';
  fontStyle?: TextStyle | Array<TextStyle>;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  closeContainerStyle?: ViewStyle | Array<ViewStyle>;
};

/**
 * Explicit overlay
 */
@observer
export default class ExplicitOverlay extends Component<PropsType> {
  /**
   * Default props
   */
  static defaultProps = {
    iconSize: 80,
    hideText: false,
    iconPosition: 'right',
  };

  /**
   * toggle overlay
   */
  toogle = () => {
    this.props.entity.toggleMatureVisibility();
  };

  /**
   * Render
   */
  render() {
    const {
      iconSize,
      hideText,
      fontStyle,
      containerStyle,
      closeContainerStyle,
      iconPosition,
    } = this.props;

    if (this.props.entity.mature_visibility) {
      const size = Math.max(iconSize / 2.5, 25);
      const styles =
        iconPosition === 'right'
          ? [CS.positionAbsoluteTopRight, CS.paddingRight3x, CS.marginRight3x]
          : [CS.positionAbsoluteTop, CS.paddingLeft3x, CS.marginLeft3x];
      return (
        <View style={[styles, closeContainerStyle]}>
          <Icon
            name="explicit"
            size={size}
            color={'red'}
            style={CS.shadow}
            onPress={this.toogle}
          />
        </View>
      );
    }

    const text = GOOGLE_PLAY_STORE
      ? i18n.t('postCantBeShown')
      : i18n.t('confirm18');

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          CS.positionAbsolute,
          CS.centered,
          CS.backgroundDarkGreyed,
          styles.onTop,
          containerStyle,
        ]}
        onPress={this.toogle}>
        <Icon
          name="explicit"
          size={iconSize}
          color={'white'}
          style={CS.shadow}
        />
        {!hideText && (
          <Text style={[CS.colorWhite, CS.shadow, fontStyle]}>{text}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  onTop: {
    zIndex: 99999,
  },
});
