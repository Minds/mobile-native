import React from 'react';

import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

const ActivityIndicator = (props) => (
  <RNActivityIndicator
    color={ThemedStyles.getColor('secondary_text')}
    {...props}
  />
);

export default ActivityIndicator;
