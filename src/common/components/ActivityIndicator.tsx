import React from 'react';

import {
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native';
import sp from '~/services/serviceProvider';

const ActivityIndicator = (props: ActivityIndicatorProps) => (
  <RNActivityIndicator color={sp.styles.getColor('SecondaryText')} {...props} />
);

export default ActivityIndicator;
