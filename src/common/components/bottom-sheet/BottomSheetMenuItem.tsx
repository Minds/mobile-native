import React from 'react';
import { View } from 'react-native';
import { Icon, IconType } from 'react-native-elements';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import MPressable from '../MPressable';
import MText from '../MText';
import { B1 } from '~ui';

export type BottomSheetMenuItemProps = {
  title: string | JSX.Element;
  iconName?: string;
  iconType?: IconType;
  icon?: JSX.Element;
  iconSize?: number;
  testID?: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
};

const BottomSheetMenuItem = ({
  iconName,
  iconType,
  icon,
  title,
  onPress,
  iconSize,
  style,
  textStyle,
  testID = '',
}: BottomSheetMenuItemProps) => {
  iconSize = iconSize || 24;

  const txtStyle = useStyle(styles.menuText, textStyle);
  const containerStyle = useStyle(styles.menuContainer, style);

  return (
    <MPressable
      style={containerStyle}
      onPress={onPress}
      testID={testID}
      disabled={!onPress}>
      {(!!iconName || !!icon) && (
        <View style={styles.iconContainer}>
          {iconName ? (
            <Icon
              size={iconSize}
              name={iconName!}
              type={iconType}
              iconStyle={
                iconName === 'ios-radio-button-on'
                  ? ThemedStyles.style.colorIconActive
                  : ThemedStyles.style.colorSecondaryText
              }
            />
          ) : (
            icon
          )}
        </View>
      )}
      {textStyle ? (
        <MText style={txtStyle}>{title}</MText>
      ) : (
        <B1 font="medium">{title}</B1>
      )}
    </MPressable>
  );
};

export default BottomSheetMenuItem;

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
