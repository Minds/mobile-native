import ThemedStyles from '../../../styles/ThemedStyles';

export const actionsContainerStyle = ThemedStyles.combine(
  'rowJustifyCenter',
  'paddingHorizontal3x',
  'paddingVertical4x',
  'alignCenter',
);

export const iconActiveStyle = ThemedStyles.combine('colorLink', 'marginRight');
export const iconNormalStyle = ThemedStyles.combine('colorIcon', 'marginRight');
export const iconDisabledStyle = ThemedStyles.combine(
  'colorTertiaryText',
  'marginRight',
);
