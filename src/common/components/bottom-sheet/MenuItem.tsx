import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, View } from 'react-native';
import { Icon, IconType } from 'react-native-elements';

import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  title: string;
  iconName: string;
  iconType: IconType;
  iconSize?: number;
  onPress: () => void;
};

const MenuItem = ({
  iconName,
  iconType,
  title,
  onPress,
  iconSize,
}: PropsType) => {
  iconSize = iconSize || 25;
  return (
    <TouchableOpacity style={styles.menuContainer} onPress={onPress}>
      {Boolean(iconName) && (
        <View style={styles.iconContainer}>
          <Icon
            size={iconSize}
            name={iconName}
            type={iconType}
            iconStyle={ThemedStyles.style.colorSecondaryText}
          />
        </View>
      )}
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = ThemedStyles.create({
  iconContainer: [{ width: 25 }, 'alignCenter'],
  menuContainer: ['alignCenter', 'rowJustifyStart', 'paddingVertical3x'],
  menuText: ['fontL', 'fontMedium', 'paddingLeft4x'],
});
