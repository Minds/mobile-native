import React from 'react';
import { Text } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';

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

  return <Text style={subTitleStyle}>{children}</Text>;
};

export default MenuSubtitle;
