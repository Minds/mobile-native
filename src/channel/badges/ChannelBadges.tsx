import React, { FC, PureComponent } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type UserModel from '../UserModel';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { Popable } from 'react-native-popable';

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
  size?: number;
  style?: ViewStyle;
  iconStyle: TextStyle;
};

/**
 * Channel Badges
 */
export default class ChannelBadges extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    const size = this.props.size || 25;
    const channel = this.props.channel;

    const badges: Array<React.ReactNode> = [];

    const style = this.props.iconStyle
      ? [styles.icon, this.props.iconStyle]
      : styles.icon;

    if (channel.plus) {
      badges.push(
        <BadgeTooltip
          label={i18n.t('channel.badge.plus')}
          color={ThemedStyles.getColor('Link')}>
          {/* @ts-ignore style not defined in types */}
          <Icon name="add-circle-outline" size={size} style={style} key={1} />
        </BadgeTooltip>,
      );
    }

    if (channel.verified) {
      badges.push(
        <BadgeTooltip
          label={i18n.t('channel.badge.verified')}
          color={ThemedStyles.getColor('SuccessBackground')}>
          <Icon
            name="verified-user"
            size={size}
            style={[
              styles.icon,
              this.props.iconStyle as any,
              channel.isAdmin() ? ThemedStyles.style.colorGreen : null,
            ]}
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
          {/* @ts-ignore style not defined in types */}
          <Icon name="flight-takeoff" size={size} style={style} key={3} />
        </BadgeTooltip>,
      );
    }

    return <>{badges}</>;
  }
}

const styles = ThemedStyles.create({
  view: {
    flexDirection: 'row',
    backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  icon: {
    alignSelf: 'center',
  },
  badgeLabelStyle: ['colorWhite'],
});
