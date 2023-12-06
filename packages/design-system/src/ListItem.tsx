import { StackProps, styled } from '@tamagui/core';
import { Text } from './Text';
import { View } from './View';
import { Icon, IconNames } from './icons';
import { StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { XStack, YStack } from '@tamagui/stacks';

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

const BaseListItemFrame = styled(XStack, {
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
              // @ts-ignore TODO: fix TS errors of tamagui
              <Avatar sSize="m" bordered url={avatarUrl} />
            ) : (
              leftIcon && <Icon name={leftIcon} size="$3" />
            )}
          </View>
        )}

        {/* Content section */}
        <YStack f={1} jc="center">
          {/* @ts-ignore TODO: fix TS errors of tamagui */}
          <Text fow={'500'}>{props.title}</Text>
          {!!props.subtitle && (
            // @ts-ignore TODO: fix TS errors of tamagui
            <Text color="$colorTextSecondary" size="$b2" fow={'400'}>
              {props.subtitle}
            </Text>
          )}
        </YStack>

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
