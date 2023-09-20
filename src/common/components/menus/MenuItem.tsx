import React, { ReactNode, useMemo } from 'react';
import { Image } from 'expo-image';
import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import { AvatarSource } from '../../../channel/UserModel';
import ThemedStyles, { useMemoStyle } from '../../../styles/ThemedStyles';
import { B2, Column, Icon, IIconColor, IIconSize, Row } from '../../ui';
import { IconMapNameType } from '../../ui/icons/map';
import MPressable from '../MPressable';
import MText from '../MText';
import { TypographyPropsType } from '../../ui/typography/Typography';
import { ColorsNameType } from '../../../styles/Colors';

export type MenuItemProps = {
  containerItemStyle?: StyleProp<ViewStyle>;
  avatar?: AvatarSource;
  title: string | ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string;
  icon?: IconMapNameType | ReactNode;
  leftIcon?: IconMapNameType | ReactNode;
  iconSize?: IIconSize;
  iconColor?: IIconColor;
  borderless?: boolean;
  label?: string;
  noBorderTop?: boolean;
  onTitlePress?: () => void;
  noIcon?: boolean;
  /**
   * Whether the title can be multiline
   * @default false
   */
  multiLine?: boolean;
  reversedIcon?: boolean;
  avatarSize?: number;
  children?: ReactNode;
  alignTop?: boolean;
  primaryColor?: ColorsNameType;
  secondaryColor?: TypographyPropsType['color'];
  isRightIconButton?: boolean;
} & TouchableHighlightProps;

export default function ({
  containerItemStyle,
  title,
  subtitle,
  onPress,
  icon,
  iconSize,
  iconColor,
  avatar,
  borderless,
  label,
  noBorderTop,
  noIcon,
  titleStyle,
  multiLine,
  children,
  reversedIcon,
  avatarSize,
  alignTop,
  isRightIconButton,
  ...props
}: MenuItemProps) {
  const containerStyle = useMemoStyle(() => {
    const stylesList: any = [
      'rowJustifyStart',
      'alignCenter',
      'paddingVertical4x',
      'paddingHorizontal4x',
    ];
    if (!borderless) {
      stylesList.push(
        'borderTopHair',
        'borderBottomHair',
        'bcolorPrimaryBorder',
      );
    }
    if (noBorderTop) {
      stylesList.push('borderTop0x');
    }
    if (containerItemStyle) {
      stylesList.push(containerItemStyle);
    }
    return stylesList;
  }, [containerItemStyle, borderless]);

  const theTitleStyle = useMemoStyle(() => {
    const stylesList: any[] = ['fontL', 'fontMedium'];

    if (titleStyle) {
      stylesList.push(titleStyle);
    }
    if (props.primaryColor) {
      stylesList.push({
        color: ThemedStyles.getColor(props.primaryColor),
      });
    }

    return stylesList;
  }, [titleStyle, props.primaryColor]);

  const leftIcon = useMemo(() => {
    if (!props.leftIcon) {
      return null;
    }

    if (typeof props.leftIcon === 'string') {
      return (
        <Icon
          name={props.leftIcon as IconMapNameType}
          size={iconSize}
          color={iconColor}
        />
      );
    }

    return props.leftIcon;
  }, [iconColor, iconSize, props.leftIcon]);

  const rightIcon = useMemo(() => {
    if (!icon && onPress) {
      return (
        <Icon
          name={'chevron-right'}
          color={props.primaryColor}
          size={iconSize}
        />
      );
    }

    if (typeof icon === 'string') {
      return (
        <Icon
          name={icon as IconMapNameType}
          size={iconSize}
          color={iconColor}
        />
      );
    }

    return icon;
  }, [icon, iconColor, iconSize, onPress, props.primaryColor]);

  const avatarStyle = useMemoStyle(() => {
    const avatarStyles = [styles.avatar];
    if (avatarSize) {
      avatarStyles.push({
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
      });
    }
    if (alignTop) {
      avatarStyles.push({ alignSelf: 'flex-start' });
    }
    return avatarStyles;
  }, [avatarSize, alignTop]);

  const rightIconStyle = useMemoStyle(() => {
    const _styles = [styles.rightIcon];
    if (alignTop) {
      _styles.push({
        top: 16,
      });
    }
    return _styles;
  }, [alignTop]);

  const shouldRenderIcon = Boolean(rightIcon) && !noIcon;

  const iconButtonStyle = isRightIconButton ? { paddingRight: 45 } : undefined;

  return (
    <MPressable {...props} onPress={onPress} style={containerStyle}>
      {avatar && <Image source={avatar} style={avatarStyle} />}
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {reversedIcon && shouldRenderIcon && (
        <View style={styles.leftIcon}>{rightIcon}</View>
      )}
      <Column
        flex
        containerStyle={iconButtonStyle}
        right={shouldRenderIcon && !reversedIcon ? 'L2' : undefined}>
        <Row align="centerBetween">
          <MText
            style={theTitleStyle}
            numberOfLines={multiLine ? undefined : 1}>
            {title}
          </MText>
          {Boolean(label) && (
            <B2
              color="secondary"
              numberOfLines={1}
              right={shouldRenderIcon && !reversedIcon ? 'M' : undefined}>
              {label}
            </B2>
          )}
        </Row>
        {Boolean(subtitle) && (
          <B2
            color={props.secondaryColor ?? 'secondary'}
            testID={`subtitle-${subtitle}`}>
            {subtitle}
          </B2>
        )}
        {children}
      </Column>
      {!reversedIcon && shouldRenderIcon && (
        <View style={rightIconStyle}>{rightIcon}</View>
      )}
    </MPressable>
  );
}

const styles = ThemedStyles.create({
  avatar: [
    {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    'bgTertiaryBackground',
    'marginRight4x',
  ],
  rightIcon: {
    position: 'absolute',
    right: 15,
  },
  leftIcon: ['marginRight4x'],
});
