import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import ThemedStyles from '~/styles/ThemedStyles';
import { IconCircled } from '~ui/icons';
import {
  AVATAR_SIZE,
  ICON_SIZES,
  AVATAR_SIZE_DEFAULT,
  UNIT,
} from '~styles/Tokens';

const Avatar = ({
  source,
  size = AVATAR_SIZE_DEFAULT,
  border,
  borderWhite,
  icon,
  onPress,
}: any) => {
  const containerStyle = [
    styles.container,
    border && styles.border,
    borderWhite && styles.borderWhite,
  ];
  const image = <FastImage source={source} style={styles[size]} />;
  let extra: any = null;

  if (icon) {
    extra = <IconCircled style={styles.icon} name="menu" size="micro" />;
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={containerStyle}>
        {image}
        {extra}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle}>
      {image}
      {extra}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: AVATAR_SIZE.large,
  },
  border: {
    borderWidth: UNIT.XXS,
    borderColor: ThemedStyles.getColor('Icon'),
  },
  borderWhite: {
    borderColor: ThemedStyles.getColor('White'),
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -ICON_SIZES.micro / 2,
    right: -ICON_SIZES.micro / 2,
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
