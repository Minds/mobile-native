import React from 'react';
import { Image, View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import MText from './MText';

type PropsType = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function Empty({ title, subtitle, children }: PropsType) {
  return (
    <View style={styles.emptyContainer}>
      <Image
        style={styles.image}
        source={require('../../assets/images/emptyFeed.png')}
      />
      {Boolean(title) && <MText style={styles.header}>{title}</MText>}
      {Boolean(subtitle) && <MText style={styles.subtitle}>{subtitle}</MText>}
      {children}
    </View>
  );
}

const styles = ThemedStyles.create({
  emptyContainer: ['centered', 'paddingTop7x', 'paddingBottom20x'],
  subtitle: [
    'colorSecondaryText',
    'fontL',
    'paddingBottom6x',
    'paddingTop2x',
    'textCenter',
  ],
  image: {
    width: 176,
    height: 122,
  },
  header: ['fontXXL', 'fontBold', 'paddingBottom', 'paddingTop6x'],
});
