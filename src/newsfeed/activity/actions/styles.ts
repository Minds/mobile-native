import ThemedStyles from '../../../styles/ThemedStyles';

export const actionsContainerStyle = ThemedStyles.combine(
  'flexColumn',
  'margin',
  'paddingVertical2x',
  'alignCenter',
);

export const actionsContainerWrapper = ThemedStyles.combine(
  'alignCenter',
  'margin',
  'rowJustifyCenter',
  'alignCenter',
  'flexWrap',
);

export const iconActiveStyle = ThemedStyles.combine('colorLink', 'marginRight');
export const iconNormalStyle = ThemedStyles.combine('colorIcon', 'marginRight');
export const iconDisabledStyle = ThemedStyles.combine(
  'colorTertiaryText',
  'marginRight',
);
