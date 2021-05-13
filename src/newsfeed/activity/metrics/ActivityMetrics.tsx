import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { Icon } from 'react-native-elements';
import moment from 'moment-timezone';
import _ from 'lodash';

import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import formatDate from '../../../common/helpers/date';
import i18n from '../../../common/services/i18n.service';
import i18nService from '../../../common/services/i18n.service';
import abbrev from '../../../common/helpers/abbrev';
import LockTag from '../../../wire/v2/lock/LockTag';
import type { SupportTiersType } from '../../../wire/WireTypes';
import { getLockType } from '../../../wire/v2/lock/Lock';

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

    const support_tier: SupportTiersType | null =
      entity.wire_threshold &&
      _.isObject(entity.wire_threshold) &&
      'support_tier' in entity.wire_threshold
        ? entity.wire_threshold.support_tier
        : null;

    const lockType = support_tier ? getLockType(support_tier) : null;

    const date = formatDate(
      this.props.entity.time_created,

      moment(parseInt(this.props.entity.time_created, 10) * 1000).isAfter(
        moment().subtract(2, 'days'),
      )
        ? 'friendly'
        : 'date',
    );

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>
          {entity.impressions > 0
            ? abbrev(entity.impressions, 1) +
              ` ${i18n.t('views').toLowerCase()} · `
            : ''}
          {date}
        </Text>

        {this.props.entity.boosted ? (
          <View style={boostedContainerStyle}>
            <Icon
              type="ionicon"
              name="md-trending-up"
              size={18}
              style={theme.marginRight}
              color={ThemedStyles.getColor('link')}
            />

            <Text style={boostedTextStyle}>
              {i18nService.t('boosted').toUpperCase()}
            </Text>
          </View>
        ) : undefined}
        {lockType !== null && <LockTag type={lockType} />}
      </View>
    );
  }
}

const containerStyle = ThemedStyles.combine(
  'rowJustifySpaceBetween',
  'padding2x',
  'paddingLeft4x',
);

const textStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'fontM',
  'paddingVertical',
);

const boostedTextStyle = ThemedStyles.combine(
  'marginRight2x',
  'colorLink',
  'fontS',
);

const boostedContainerStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'centered',
);
