import React from 'react';
import { View } from 'react-native';
import { Icon, IconType } from 'react-native-elements';
import MPressable from '../MPressable';
import MText from '../MText';
import { B1 } from '~ui';
import { useStyle } from '~/styles/hooks';
import sp from '~/services/serviceProvider';

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
  const themedStyles = sp.styles;
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
                  ? themedStyles.style.colorIconActive
                  : themedStyles.style.colorSecondaryText
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

const styles = sp.styles.create({
  iconContainer: [{ width: 25 }, 'alignCenter', 'marginRight4x'],
  menuContainer: [
    'alignCenter',
    'rowJustifyStart',
    'paddingVertical3x',
    'paddingHorizontal5x',
  ],
  menuText: ['fontL', 'fontMedium'],
});
