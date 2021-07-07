import React from 'react';

import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

const ActivityIndicator = props => (
  <RNActivityIndicator
    color={ThemedStyles.getColor('SecondaryText')}
    {...props}
  />
);

export default ActivityIndicator;
