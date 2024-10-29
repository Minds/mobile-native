import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Icon from '@expo/vector-icons/SimpleLineIcons';
import { GOOGLE_PLAY_STORE } from '~/config/Config';
import type ActivityModel from '~/newsfeed/ActivityModel';
import type UserModel from '~/channel/UserModel';

import GroupModel from '~/groups/GroupModel';
import MText from '../MText';
import sp from '~/services/serviceProvider';

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
    //@ts-ignore we ignore the type error on the localization
    const reasons = this.props.entity.nsfw?.map(i => sp.i18n.t(`nsfw.${i}`));

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

    const theme = sp.styles.style;

    if (this.props.entity.mature_visibility) {
      return null;
    }

    const i18n = sp.i18n;
    const text =
      GOOGLE_PLAY_STORE || Platform.OS === 'ios'
        ? i18n.t('postCantBeShown')
        : i18n.t('confirm18');

    return (
      <View
        pointerEvents="box-none"
        style={[
          theme.flexColumnStretch,
          theme.bgSecondaryBackground,
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
              <MText
                style={[
                  theme.colorPrimaryText,
                  theme.paddingTop6x,
                  theme.fontXL,
                  theme.bold,
                  fontStyle,
                ]}>
                {this.props.text}
              </MText>
            )}
            <MText
              style={[
                theme.colorPrimaryText,
                theme.paddingTop6x,
                theme.fontXXL,
                theme.bold,
              ]}>
              NSFW
            </MText>
            <MText
              style={[
                theme.colorTertiaryText,
                theme.paddingVertical2x,
                theme.marginBottom6x,
                theme.fontXL,
              ]}>
              {this.getLocalizedReasons()}
            </MText>
            <TouchableOpacity
              style={[
                theme.bcolorPrimaryBorder,
                theme.borderHair,
                theme.bgPrimaryBackground,
                theme.margin4x,
              ]}
              onPress={this.toggle}>
              <MText style={[theme.padding2x, theme.fontL, fontStyle]}>
                {text}
              </MText>
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
    alignItems: 'center',
  },
});
