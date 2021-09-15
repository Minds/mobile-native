import React from 'react';

import {
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

const ActivityIndicator = (props: ActivityIndicatorProps) => (
  <RNActivityIndicator
    color={ThemedStyles.getColor('SecondaryText')}
    {...props}
  />
);

export default ActivityIndicator;
