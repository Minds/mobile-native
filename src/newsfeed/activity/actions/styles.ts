import sp from '~/services/serviceProvider';
export const actionsContainerStyle = sp.styles.combine(
  'flexColumn',
  'margin',
  'paddingVertical3x',
  'alignCenter',
);

export const actionsContainerWrapper = sp.styles.combine(
  {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  'margin',
);

export const iconActiveStyle = sp.styles.combine('colorLink', 'marginRight');
export const iconNormalStyle = sp.styles.combine('colorIcon', 'marginRight');
export const iconDisabledStyle = sp.styles.combine(
  'colorTertiaryText',
  'marginRight',
);
