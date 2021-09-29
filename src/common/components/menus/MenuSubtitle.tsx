import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

type PropsType = {
  children: React.ReactNode;
};

const MenuSubtitle = ({ children }: PropsType) => {
  const theme = ThemedStyles.style;
  const subTitleStyle = [
    theme.colorSecondaryText,
    theme.fontMedium,
    theme.fontM,
    theme.marginTop5x,
    theme.marginBottom2x,
    theme.paddingHorizontal4x,
  ];

  return <MText style={subTitleStyle}>{children}</MText>;
};

export default MenuSubtitle;
