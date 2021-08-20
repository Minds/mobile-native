import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import React from 'react';

const Handle = ({ children }) => (
  <View
    style={[
      {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10,
      },
      ThemedStyles.style.bgPrimaryBackground,
    ]}>
    <View style={[ThemedStyles.style.alignCenter]}>
      <View
        style={[
          {
            width: 30,
            height: 5,
            borderRadius: 10,
          },
          ThemedStyles.style.bgTertiaryBackground,
        ]}
      />
    </View>

    {children}
  </View>
);

export default Handle;
