import { View } from 'react-native';
import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import WebViewScreen from '~/common/screens/WebViewScreen';
import Topbar from '~/topbar/Topbar';

export default function WebViewTab(props) {
  return (
    <View style={ThemedStyles.style.flexContainer}>
      <Topbar title={props.route.params?.title} navigation={props.navigation} />
      <WebViewScreen {...props} />
    </View>
  );
}
