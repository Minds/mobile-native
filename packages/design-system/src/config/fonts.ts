// debug
import { createFont } from '@tamagui/core';
import { useFonts } from 'expo-font';

const regularFont = 'Roboto-Regular';
const mediumFont = 'Roboto-Medium';
const boldFont = 'Roboto-Bold';
const blackFont = 'Roboto-Black';

const body = createFont({
  family: regularFont,
  size: {
    // for buttons
    3: 14, // S
    3.5: 16, // M
    4: 19, // L
    5: 19, // XL

    b3: 12,
    b2: 14,
    b1: 16,
    b: 16,
    h4: 19,
    h3: 23,
    h2: 28,
    h1: 34,
    xl3: 40,
    xl2: 48,
    xl1: 64,
  },
  lineHeight: {
    // for buttons
    3: 20, // S
    3.5: 22, // M
    4: 28, // L
    5: 28, // XL

    b3: 17,
    b2: 20,
    b1: 22,
    b: 22,
    h4: 27,
    h3: 32,
    h2: 39,
    h1: 48,
    xl3: 48,
    xl2: 58,
    xl1: 72,
  },
  letterSpacing: {
    b: 0,
    h1: -0.16,
    4: 0.16,
  },
  weight: {
    3: '700',
    b: '400',
  },
  face: {
    '400': { normal: regularFont },
    '500': { normal: mediumFont },
    '700': { normal: boldFont },
    '900': { normal: blackFont },
  },
});

export const fonts = {
  body,
};

export const useFontsLoaded = () =>
  useFonts({
    'Roboto-Regular': require('~/assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('~/assets/fonts/Roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('~/assets/fonts/Roboto/Roboto-Bold.ttf'),
    'Roboto-Black': require('~/assets/fonts/Roboto/Roboto-Black.ttf'),
  });
