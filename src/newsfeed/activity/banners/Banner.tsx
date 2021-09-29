import React from 'react';
import { View } from 'react-native';
import MText from '../../../common/components/MText';
import { styles } from '../styles';

type PropsType = {
  message: string;
};

const Banner = ({ message }: PropsType) => {
  return (
    <View style={styles.yellowBanner}>
      <MText style={styles.yellowBannerText}>{message}</MText>
    </View>
  );
};

export default Banner;
