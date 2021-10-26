import React, { FC, PureComponent } from 'react';
import { IconNextSpacer } from '~ui/icons';
import type UserModel from '../UserModel';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { Popable } from 'react-native-popable';
import { Row, SpacerPropType } from '~ui';

/**
 * Badge tooltip using Poppable because react-native-elements/Tooltip
 * doesn't have a way to show the Tooltip on top
 **/
const BadgeTooltip: FC<any> = ({ label, color, children }) => {
  return (
    <Popable
      backgroundColor={color}
      position={'top'}
      animationType={'spring'}
      content={label}>
      {children}
    </Popable>
  );
};

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

    if (channel.plus) {
      badges.push(
        <BadgeTooltip
          label={i18n.t('channel.badge.plus')}
          color={ThemedStyles.getColor('Link')}>
          <IconNextSpacer
            active
            name="plus-circle-outline"
            size={size}
            horizontal="XXXS"
            key={1}
          />
        </BadgeTooltip>,
      );
    }

    if (channel.verified) {
      badges.push(
        <BadgeTooltip
          label={i18n.t('channel.badge.verified')}
          color={ThemedStyles.getColor('SuccessBackground')}>
          <IconNextSpacer
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

    if (channel.founder) {
      badges.push(
        <BadgeTooltip
          label={i18n.t('channel.badge.founder')}
          color={ThemedStyles.getColor('Link')}>
          <IconNextSpacer
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
