import React from 'react';
import { Text, View } from 'react-native';
import { Icon, IconType } from 'react-native-elements';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import MPressable from '../MPressable';

export type MenuItemProps = {
  title: string;
  iconName?: string;
  iconType?: IconType;
  iconSize?: number;
  testID?: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
};

const MenuItem = ({
  iconName,
  iconType,
  title,
  onPress,
  iconSize,
  style,
  textStyle,
  testID = '',
}: MenuItemProps) => {
  iconSize = iconSize || 25;

  const txtStyle = useStyle(styles.menuText, textStyle);
  const containerStyle = useStyle(styles.menuContainer, style);

  return (
    <MPressable style={containerStyle} onPress={onPress}>
      {Boolean(iconName) && (
        <View style={styles.iconContainer}>
          <Icon
            size={iconSize}
            name={iconName!}
            type={iconType}
            iconStyle={ThemedStyles.style.colorSecondaryText}
          />
        </View>
      )}
      <Text style={txtStyle}>{title}</Text>
    </MPressable>
  );
};

export default MenuItem;

const styles = ThemedStyles.create({
  iconContainer: [{ width: 25 }, 'alignCenter', 'marginRight4x'],
  menuContainer: [
    'alignCenter',
    'rowJustifyStart',
    'paddingVertical3x',
    'paddingHorizontal5x',
  ],
  menuText: ['fontL', 'fontMedium'],
});
