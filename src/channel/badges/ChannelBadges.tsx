import React, { FC, PureComponent } from 'react';
import { IconNext } from '~ui/icons';
import type UserModel from '../UserModel';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { Popable } from 'react-native-popable';
import { B3, Row, SpacerPropType } from '~ui';

/**
 * Badge tooltip using Poppable because react-native-elements/Tooltip
 * doesn't have a way to show the Tooltip on top
 **/
const BadgeTooltip: FC<any> = ({ label, color, children }) => {
  const fontColor = ThemedStyles.theme === 1 ? 'black' : 'white';
  return (
    <Popable
      backgroundColor={color}
      position={'top'}
      animationType={'spring'}
      content={
        <B3 color={fontColor} align="center" vertical="XS">
          {label}
        </B3>
      }>
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

    if (channel.verified) {
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

    if (channel.founder) {
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
