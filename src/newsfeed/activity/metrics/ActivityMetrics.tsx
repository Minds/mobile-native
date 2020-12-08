import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react';

import number from '../../../common/helpers/number';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import formatDate from '../../../common/helpers/date';
import i18n from '../../../common/services/i18n.service';
import ChannelBadge from '../../../channel/badges/ChannelBadges';

type PropsType = {
  entity: ActivityModel;
};

/**
 * Activity metrics component
 */
@observer
export default class ActivityMetrics extends Component<PropsType> {
  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const theme = ThemedStyles.style;

    return (
      <View style={[theme.rowJustifySpaceBetween, theme.padding2x]}>
        <Text style={[theme.colorSecondaryText, theme.fontLM, theme.padding]}>
          {entity.impressions > 0
            ? number(entity.impressions, 0) + ` ${i18n.t('views')} · `
            : ''}
          {formatDate(this.props.entity.time_created, 'friendly')}
        </Text>
        <ChannelBadge
          size={20}
          channel={this.props.entity.ownerObj}
          iconStyle={theme.colorSecondaryText}
        />
      </View>
    );
  }
}
