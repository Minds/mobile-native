import React from 'react';

import { TouchableOpacity } from 'react-native';

export default function Touchable(props) {
  return <TouchableOpacity activeOpacity={0.65} {...props} />;
}
