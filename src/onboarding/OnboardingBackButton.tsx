import React from 'react';

import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type PropsType = {
  onBack: () => void;
};

export default function (props: PropsType) {
  return (
    <View>
      <TouchableOpacity onPress={props.onBack}>
        <Icon size={34} name="keyboard-arrow-left" color="#777777" />
      </TouchableOpacity>
    </View>
  );
}
