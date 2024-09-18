import React, { Component } from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../newsfeed/ActivityModel';

import IconMa from '@expo/vector-icons/MaterialIcons';
import { Platform, StyleSheet, View } from 'react-native';
import MText from './MText';
import sp from '~/services/serviceProvider';

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
    const theme = sp.styles.style;
    if (!this.props.entity.pinned) return null;

    return (
      <View style={pinnedContainer}>
        <IconMa name="push-pin" size={15} style={pinnedIconStyle} />

        <MText style={theme.colorSecondaryText}>
          {sp.i18n.t('pinnedPost')}{' '}
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

const pinnedContainer = sp.styles.combine(
  'paddingVertical2x',
  'paddingHorizontal4x',
  'borderBottomHair',
  'bcolorPrimaryBorder',
  'rowJustifyStart',
);

const pinnedIconStyle = sp.styles.combine('colorIconActive', styles.pinnedIcon);
