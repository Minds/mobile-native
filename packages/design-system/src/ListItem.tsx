import { StackProps, styled } from '@tamagui/core';
import { Text } from './Text';
import { Column, Row, View } from './View';
import { Icon, IconNames } from './icons';
import { StyleSheet } from 'react-native';
import { Avatar } from './Avatar';

type ListItemProps = {
  /**
   * The title of the list item
   */
  title: string;
  /**
   * The text that appears below the title
   */
  subtitle?: string;
  /**
   * The icon that appears on the left
   */
  leftIcon?: IconNames;
  /**
   * The icon that appears on the right
   */
  rightIcon?: IconNames;
  onPress?: () => void;
  /**
   * Whether the list item should have a bottom border or not
   */
  borderless?: boolean;
  avatarUrl?: string;
} & StackProps;

const BaseListItemFrame = styled(Row, {
  padding: '$3',
  paddingLeft: '$4',
  pressStyle: {
    bc: '$backgroundSecondary',
  },
  bbw: StyleSheet.hairlineWidth,
  bbc: 'transparent',
  ai: 'center',
});

export const ListItem = BaseListItemFrame.extractable(
  (props: ListItemProps) => {
    const { leftIcon, rightIcon, avatarUrl } = props;
    return (
      <BaseListItemFrame
        {...props}
        bbc={!props.borderless ? '$borderColor' : undefined}
        onPress={props.onPress}
        disabled={!props.onPress}>
        {/* Left section */}
        {(avatarUrl || leftIcon) && (
          <View mr="$3" mt="$1" als="flex-start">
            {avatarUrl ? (
              <Avatar sSize="m" bordered url={avatarUrl} />
            ) : (
              leftIcon && <Icon name={leftIcon} size="$3" />
            )}
          </View>
        )}

        {/* Content section */}
        <Column f={1} jc="center">
          <Text fow={'500'}>{props.title}</Text>
          {!!props.subtitle && (
            <Text color="$colorTextSecondary" size="$b2" fow={'400'}>
              {props.subtitle}
            </Text>
          )}
        </Column>

        {/* Right section */}
        {!!rightIcon && (
          <View ml="$2">
            <Icon name={rightIcon} />
          </View>
        )}
      </BaseListItemFrame>
    );
  },
);
