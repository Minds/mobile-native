import React from 'react';
import { DeltaIconPropsType } from '../TransactionsListTypes';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../../../styles/ThemedStyles';

export const DeltaIcon = ({ delta }: DeltaIconPropsType) => {
  let iconName, iconColor;
  switch (delta) {
    case 'neutral':
      iconName = 'menu-right';
      iconColor = 'yellow';
      break;
    case 'positive':
      iconName = 'menu-up';
      iconColor = '#417505';
      break;
    case 'negative':
      iconName = 'menu-down';
      iconColor = '#D0021B';
      break;
  }
  return <MIcon name={iconName} color={iconColor} size={20} />;
};

export const AvatarIcon = ({ name }) => (
  <MIcon
    name={name}
    color={ThemedStyles.getColor('Icon')}
    size={36}
    style={ThemedStyles.style.marginRight3x}
  />
);
