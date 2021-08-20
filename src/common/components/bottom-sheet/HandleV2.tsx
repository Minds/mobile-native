import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import React from 'react';

const Handle = ({ children, showHandle = false }) => (
  <View
    style={[
      {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 5,
      },
      ThemedStyles.style.bgPrimaryBackground,
      ThemedStyles.style.borderBottomHair,
      ThemedStyles.style.bcolorPrimaryBorder,
    ]}>
    {showHandle && (
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
    )}

    {children}
  </View>
);

export default Handle;
