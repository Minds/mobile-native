import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';

import isObject from 'lodash/isObject';

import ThemedStyles from '~/styles/ThemedStyles';
import type ActivityModel from '~/newsfeed/ActivityModel';
import i18n from '~/common/services/i18n.service';
import abbrev from '~/common/helpers/abbrev';
import LockTag from '~/wire/v2/lock/LockTag';
import type { SupportTiersType } from '~/wire/WireTypes';
import { getLockType } from '~/wire/v2/lock/Lock';
import MText from '~/common/components/MText';
import SupermindLabel from '~/common/components/supermind/SupermindLabel';
import { IS_TENANT } from '~/config/Config';

type PropsType = {
  entity: ActivityModel;
  fullDate?: boolean;
  hideSupermindLabel?: boolean;
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

    const support_tier: SupportTiersType | null =
      entity.wire_threshold &&
      isObject(entity.wire_threshold) &&
      'support_tier' in entity.wire_threshold
        ? entity.wire_threshold.support_tier
        : null;

    const lockType = support_tier ? getLockType(support_tier) : null;

    const date = i18n.date(
      parseInt(this.props.entity.time_created, 10) * 1000,
      this.props.fullDate ? 'datetime' : 'friendly',
    );

    return (
      <View style={containerStyle}>
        <MText style={textStyle}>
          {entity.impressions > 0
            ? abbrev(entity.impressions, 1) +
              ` ${i18n.t('views').toLowerCase()} · `
            : ''}
          {date}
        </MText>
        {!IS_TENANT ? (
          <LockNetworkTag name={'Some long name'} type="lock" />
        ) : (
          <>
            {lockType !== null && <LockTag type={lockType} />}
            {Boolean(this.props.entity.supermind) &&
              !this.props.hideSupermindLabel && <SupermindLabel />}
          </>
        )}
      </View>
    );
  }
}

const containerStyle = ThemedStyles.combine(
  'rowJustifySpaceBetween',
  'padding2x',
  'paddingHorizontal4x',
);

const textStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'fontM',
  'paddingVertical',
);

type LockNetworkTag = {
  name?: string;
  type: 'lock' | 'unlock';
};
const LockNetworkTag = ({ name = 'member', type }: LockNetworkTag) => {
  return (
    <View
      style={type === 'lock' ? styles.wrapperLockStyle : styles.wrapperStyle}>
      <MText
        numberOfLines={1}
        style={type === 'lock' ? styles.memberLockStyle : styles.memberStyle}>
        {name}
      </MText>
    </View>
  );
};

const wrapperStyle = ThemedStyles.combine('bcolorIconActive', 'bgLink', {
  borderWidth: 1,
  borderRadius: 3,
  paddingTop: 2,
  paddingHorizontal: 4,
  marginRight: 5,
  marginVertical: 2,
  maxWidth: '45%',
});

const memberStyle = ThemedStyles.combine('colorButtonText', {
  fontFamily: 'Roboto_500',
  fontSize: 12,
  lineHeight: 14,
});

export const styles = {
  wrapperStyle,
  memberStyle,
  wrapperLockStyle: ThemedStyles.combine(...wrapperStyle, 'bgTransparent'),
  memberLockStyle: ThemedStyles.combine(...memberStyle, 'colorPrimaryText'),
};
