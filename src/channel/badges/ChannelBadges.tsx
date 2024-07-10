import React, { PureComponent } from 'react';
import { IconNext } from '~ui/icons';
import type UserModel from '../UserModel';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '~/common/services/i18n.service';
import { Row, SpacerPropType } from '~ui';
import BadgeTooltip from '~/common/components/BadgeTooltip';
import { IS_TENANT } from '~/config/Config';

type PropsType = {
  channel: UserModel;
};

/**
 * Channel Badges
 */
export default class ChannelBadges extends PureComponent<
  PropsType & SpacerPropType
> {
  /**
   * Render
   */
  render() {
    const { channel, ...spacer } = this.props;
    const size = 'tiny';
    const badges: Array<React.ReactNode> = [];

    if (channel.source === 'activitypub') {
      const source = channel.username?.split('@')?.[1] || 'External';
      badges.push(
        <BadgeTooltip
          key="source"
          label={`${source} profile`}
          color={ThemedStyles.getColor('Link')}>
          <IconNext name="globe" size={size} active horizontal="XXXS" key={2} />
        </BadgeTooltip>,
      );
    }

    if (channel.plus) {
      badges.push(
        <BadgeTooltip
          key={'plus'}
          label={i18n.t('channel.badge.plus')}
          color={ThemedStyles.getColor('Link')}>
          <IconNext
            active
            name="plus-circle-outline"
            size={size}
            horizontal="XXXS"
            key={1}
          />
        </BadgeTooltip>,
      );
    }

    if (channel.verified && !IS_TENANT) {
      badges.push(
        <BadgeTooltip
          key={'verified'}
          label={i18n.t('channel.badge.verified')}
          color={ThemedStyles.getColor('SuccessBackground')}>
          <IconNext
            name="verified"
            size={size}
            color={channel.isAdmin() ? 'Green' : undefined}
            active
            horizontal="XXXS"
            key={2}
          />
        </BadgeTooltip>,
      );
    }

    if (channel.founder && !IS_TENANT) {
      badges.push(
        <BadgeTooltip
          key={'founder'}
          label={i18n.t('channel.badge.founder')}
          color={ThemedStyles.getColor('Link')}>
          <IconNext
            horizontal="XXXS"
            name="founder"
            active
            size={size}
            key={3}
          />
        </BadgeTooltip>,
      );
    }

    return <Row {...spacer}>{badges}</Row>;
  }
}
