import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import PressableScale from '~/common/components/PressableScale';
import ThemedStyles, { useMemoStyle } from '~/styles/ThemedStyles';
import { IconCircled } from '~ui/icons';
import { withSpacer } from '~ui/layout';
import {
  ICON_SIZES,
  AVATAR_SIZE,
  AVATAR_SIZE_DEFAULT,
  UNIT,
} from '~styles/Tokens';
import { isObservable, toJS } from 'mobx';

export const Avatar = withSpacer(
  ({
    source,
    size = AVATAR_SIZE_DEFAULT,
    border,
    icon,
    subAvatarSource,
    onPress,
    children,
    testID,
    recyclingKey,
  }: any) => {
    let iconView: any = null;
    let subAvatar: any = null;

    const subAvatarSize = styles[size].width / 1.8;
    const subAvatarStyle = useMemoStyle(
      [
        {
          position: 'absolute',
          bottom: -subAvatarSize / 4,
          right: -subAvatarSize / 4,
          width: subAvatarSize,
          height: subAvatarSize,
          borderRadius: subAvatarSize / 2,
        },
      ],
      [subAvatarSize],
    );

    if (icon) {
      iconView = <IconCircled style={styles.icon} name="menu" size="micro" />;
    }

    if (subAvatarSource) {
      subAvatar = (
        <Image
          source={
            isObservable(subAvatarSource)
              ? toJS(subAvatarSource)
              : subAvatarSource
          }
          recyclingKey={recyclingKey}
          style={subAvatarStyle}
        />
      );
    }

    const avatar = (
      <View style={border && styles[border]}>
        <Image
          testID={testID}
          source={isObservable(source) ? toJS(source) : source}
          recyclingKey={recyclingKey}
          style={styles[size]}
        />
        {iconView}
        {subAvatar}
        {children}
      </View>
    );

    if (onPress) {
      return <PressableScale onPress={onPress}>{avatar}</PressableScale>;
    }

    return avatar;
  },
);

const styles = ThemedStyles.create({
  active: [
    { borderWidth: UNIT.XXS, borderRadius: AVATAR_SIZE.large },
    'bcolorAvatarActive',
  ],
  solid: [
    { borderWidth: UNIT.XXS, borderRadius: AVATAR_SIZE.large },
    'bcolorAvatarCircled',
  ],
  white: {
    borderWidth: UNIT.XXS,
    borderRadius: AVATAR_SIZE.large,
    borderColor: ThemedStyles.getColor('White'),
  },
  primary: [
    {
      borderWidth: UNIT.XXS,
      borderRadius: AVATAR_SIZE.large,
      borderColor: ThemedStyles.getColor('PrimaryBackground'),
    },
  ],
  transparent: { borderColor: 'transparent', borderWidth: UNIT.XXS },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -ICON_SIZES.micro / 2,
    right: -ICON_SIZES.micro / 2,
  },
  nano: {
    width: AVATAR_SIZE.nano,
    height: AVATAR_SIZE.nano,
    borderRadius: AVATAR_SIZE.nano / 2,
  },
  micro: {
    width: AVATAR_SIZE.micro,
    height: AVATAR_SIZE.micro,
    borderRadius: AVATAR_SIZE.micro / 2,
  },
  tiny: {
    width: AVATAR_SIZE.tiny,
    height: AVATAR_SIZE.tiny,
    borderRadius: AVATAR_SIZE.tiny / 2,
  },
  small: {
    width: AVATAR_SIZE.small,
    height: AVATAR_SIZE.small,
    borderRadius: AVATAR_SIZE.small / 2,
  },
  medium: {
    width: AVATAR_SIZE.medium,
    height: AVATAR_SIZE.medium,
    borderRadius: AVATAR_SIZE.medium / 2,
  },
  large: {
    width: AVATAR_SIZE.large,
    height: AVATAR_SIZE.large,
    borderRadius: AVATAR_SIZE.large / 2,
  },
});
