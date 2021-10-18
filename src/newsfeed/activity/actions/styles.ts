import ThemedStyles from '../../../styles/ThemedStyles';

export const actionsContainerStyle = ThemedStyles.combine(
  'flexColumn',
  'margin',
  'paddingVertical3x',
  'alignCenter',
);

export const actionsContainerWrapper = ThemedStyles.combine(
  {
    justifyContent: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  'margin',
);

export const iconActiveStyle = ThemedStyles.combine('colorLink', 'marginRight');
export const iconNormalStyle = ThemedStyles.combine('colorIcon', 'marginRight');
export const iconDisabledStyle = ThemedStyles.combine(
  'colorTertiaryText',
  'marginRight',
);
