import React from 'react';
import * as Animatable from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
const AnimatableText = ({ msg }) => {
  if (!msg) {
    return null;
  }
  return (
    <Animatable.Text
      animation="bounceInLeft"
      useNativeDriver
      style={styles.text}
      testID="loginMsg">
      {msg}
    </Animatable.Text>
  );
};

const styles = ThemedStyles.create({
  text: ['subTitleText', 'colorSecondaryText', 'textCenter'],
});

export default AnimatableText;
