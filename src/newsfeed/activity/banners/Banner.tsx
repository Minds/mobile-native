import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

type PropsType = {
  message: string;
};

const Banner = ({ message }: PropsType) => {
  return (
    <View style={styles.yellowBanner}>
      <Text style={styles.yellowBannerText}>{message}</Text>
    </View>
  );
};

export default Banner;
