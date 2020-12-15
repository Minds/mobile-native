import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';

const bannerAspectRatio = 3.5;

type PropsType = {
  title: string;
};

const BoostHeader = ({ title }: PropsType) => {
  return (
    <ImageBackground
      style={styles.banner}
      source={require('../../assets/boostBG.png')}
      resizeMode="cover">
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </ImageBackground>
  );
};

export default BoostHeader;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  minds: {
    color: '#FFFFFF',
    fontSize: 17,
    paddingBottom: 5,
    fontFamily: 'Roboto-Black',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  text: {
    color: '#AEB0B8',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginVertical: 15,
  },
  container: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
    borderWidth: 0,
  },
  switchText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});
