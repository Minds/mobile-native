import React from 'react';
import { showMessage, hideMessage } from 'react-native-flash-message';
import ThemedStyles from '../styles/ThemedStyles';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const discardMessage = (confirm) => {
  const theme = ThemedStyles.style;

  showMessage({
    position: 'center',
    message: '',
    floating: true,
    duration: 0,
    //@ts-ignore
    renderCustomContent: () => (
      <View>
        <Text style={[theme.fontXL, theme.textCenter]} onPress={hideMessage}>
          Discard this post?
        </Text>
        <Text
          style={[theme.fontML, theme.marginTop4x, theme.textCenter]}
          onPress={hideMessage}>
          If you discard you’ll lose this post
        </Text>
        <View
          style={[
            theme.rowJustifySpaceEvenly,
            theme.marginTop6x,
            theme.paddingTop2x,
            theme.borderTopHair,
            theme.borderPrimary,
            styles.messageHorizontalLine,
          ]}>
          <View
            style={[
              theme.borderPrimary,
              theme.borderRightHair,
              theme.justifyCenter,
              styles.messageVerticalLine,
            ]}>
            <Text
              style={[theme.fontXL, theme.colorLink, theme.paddingHorizontal4x]}
              onPress={hideMessage}>
              Keep Editing
            </Text>
          </View>
          <TouchableOpacity
            style={theme.justifyCenter}
            onPress={() => {
              hideMessage();
              confirm();
            }}>
            <Text
              style={[
                theme.fontXL,
                theme.colorLink,
                theme.paddingHorizontal4x,
              ]}>
              Yes, Discard
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    color: ThemedStyles.getColor('primary_text'),
    titleStyle: ThemedStyles.style.fontXL,
    backgroundColor: ThemedStyles.getColor('secondary_background'),
    type: 'default',
  });
};

export default discardMessage;

const styles = {
  messageHorizontalLine: {
    marginLeft: -20,
    marginRight: -20,
  },
  messageVerticalLine: {
    marginTop: -10,
    marginBottom: -14,
  },
};
