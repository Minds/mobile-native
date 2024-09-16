import { View } from 'react-native';
import React from 'react';
import WebViewScreen from '~/common/screens/WebViewScreen';
import Topbar from '~/topbar/Topbar';
import sp from '~/services/serviceProvider';

export default function WebViewTab(props) {
  return (
    <View style={sp.styles.style.flexContainer}>
      <Topbar title={props.route.params?.title} navigation={props.navigation} />
      <WebViewScreen {...props} />
    </View>
  );
}
