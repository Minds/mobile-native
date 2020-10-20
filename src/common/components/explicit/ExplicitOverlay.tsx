import React, { PureComponent } from 'react';

import {
  Text,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { GOOGLE_PLAY_STORE } from '../../../config/Config';
import i18n from '../../services/i18n.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type UserModel from '../../../channel/UserModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import GroupModel from '../../../groups/GroupModel';

type PropsType = {
  entity: ActivityModel | UserModel | GroupModel;
  iconSize: number;
  hideText: boolean;
  fontStyle?: TextStyle | Array<TextStyle>;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  text?: string;
};

/**
 * Explicit overlay
 */
export default class ExplicitOverlay extends PureComponent<PropsType> {
  /**
   * Default props
   */
  static defaultProps = {
    iconSize: 55,
    hideText: false,
    iconPosition: 'right',
  };

  /**
   * toggle overlay
   */
  toggle = () => {
    this.props.entity.toggleMatureVisibility();
  };

  getLocalizedReasons() {
    const reasons = this.props.entity.nsfw?.map((i) => i18n.t(`nsfw.${i}`));

    if (!reasons) {
      return '';
    }

    if (reasons.length === 1) {
      return reasons[0];
    }
    if (reasons.length === 2) {
      return reasons.join(' & ');
    }
    if (reasons.length > 2) {
      return (
        reasons.slice(0, reasons.length - 1).join(', ') +
        ' & ' +
        reasons[reasons.length - 1]
      );
    }
  }

  /**
   * Render
   */
  render() {
    const { iconSize, hideText, fontStyle, containerStyle } = this.props;

    const theme = ThemedStyles.style;

    if (this.props.entity.mature_visibility) {
      return null;
    }

    const text =
      GOOGLE_PLAY_STORE || Platform.OS === 'ios'
        ? i18n.t('postCantBeShown')
        : i18n.t('confirm18');

    return (
      <View
        style={[
          theme.centered,
          theme.backgroundSecondary,
          styles.onTop,
          containerStyle,
        ]}>
        <Icon
          name="lock"
          size={iconSize}
          style={theme.colorSecondaryText}
          onPress={this.toggle}
        />
        {!hideText && (
          <>
            {!!this.props.text && (
              <Text
                style={[
                  theme.colorPrimaryText,
                  theme.paddingTop6x,
                  theme.fontXL,
                  theme.bold,
                  fontStyle,
                ]}>
                {this.props.text}
              </Text>
            )}
            <Text
              style={[
                theme.colorPrimaryText,
                theme.paddingTop6x,
                theme.fontXXL,
                theme.bold,
              ]}>
              NSFW
            </Text>
            <Text
              style={[
                theme.colorTertiaryText,
                theme.paddingVertical2x,
                theme.marginBottom6x,
                theme.fontXL,
              ]}>
              {this.getLocalizedReasons()}
            </Text>
            <TouchableOpacity
              style={[
                theme.borderPrimary,
                theme.borderHair,
                theme.backgroundPrimary,
                theme.margin4x,
              ]}
              onPress={this.toggle}>
              <Text style={[theme.padding2x, theme.fontL, fontStyle]}>
                {text}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  onTop: {
    minHeight: 400,
  },
});
