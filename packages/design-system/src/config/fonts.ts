// debug
import { createFont } from '@tamagui/core';
import { useFonts } from 'expo-font';

const regularFont = 'Roboto-Regular';
const mediumFont = 'Roboto-Medium';
const boldFont = 'Roboto-Bold';
const blackFont = 'Roboto-Black';
const italicFont = 'Roboto-italic';

const body = createFont({
  family: regularFont,
  size: {
    b3: 13,
    b2: 14,
    b1: 16,
    b: 16,
    h4: 18,
    h3: 20,
    h2: 24,
    h1: 30,
  },
  lineHeight: {
    b3: 16,
    b2: 20,
    b1: 24,
    b: 24,
    h4: 28,
    h3: 28,
    h2: 32,
    h1: 36,
  },
  letterSpacing: {
    b: 0,
  },
  weight: {
    b: '400',
  },
  face: {
    '400': { normal: regularFont, italic: italicFont },
    '500': { normal: mediumFont, italic: italicFont },
    '700': { normal: boldFont, italic: italicFont },
    '900': { normal: blackFont, italic: italicFont },
  },
});

export const fonts = {
  body,
};

export const useFontsLoaded = () =>
  useFonts({
    'Roboto-Regular': require('../assets/Roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/Roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../assets/Roboto/Roboto-Bold.ttf'),
    'Roboto-Black': require('../assets/Roboto/Roboto-Black.ttf'),
    'Roboto-Italic': require('../assets/Roboto/Roboto-Italic.ttf'),
  });
