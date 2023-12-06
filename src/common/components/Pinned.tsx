import React, { Component } from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../newsfeed/ActivityModel';
import ThemedStyles from '../../styles/ThemedStyles';
import IconMa from '@expo/vector-icons/MaterialIcons';
import { Platform, StyleSheet, View } from 'react-native';
import i18nService from '../services/i18n.service';
import MText from './MText';

// types
type PropsType = {
  entity: ActivityModel;
};

/**
 * Pinned icon
 */
@observer
export default class Pinned extends Component<PropsType> {
  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    if (!this.props.entity.pinned) return null;

    return (
      <View style={pinnedContainer}>
        <IconMa name="push-pin" size={15} style={pinnedIconStyle} />

        <MText style={theme.colorSecondaryText}>
          {i18nService.t('pinnedPost')}{' '}
        </MText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pinnedIcon: {
    paddingTop: Platform.select({ android: 3, ios: 1 }),
    paddingRight: 5,
  },
});

const pinnedContainer = ThemedStyles.combine(
  'paddingVertical2x',
  'paddingHorizontal4x',
  'borderBottomHair',
  'bcolorPrimaryBorder',
  'rowJustifyStart',
);

const pinnedIconStyle = ThemedStyles.combine(
  'colorIconActive',
  styles.pinnedIcon,
);
