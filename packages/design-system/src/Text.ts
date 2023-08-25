import { styled } from '@tamagui/core';
import { Paragraph } from '@tamagui/text';

export const Text = styled(Paragraph, {
  tag: 'span',
  name: 'Text',
  fontFamily: '$body',
  fontWeight: '400',
  size: '$b',
  variants: {
    type: {
      primary: {
        color: '$colorTextPrimary',
      },
      secondary: {
        color: '$colorTextSecondary',
      },
      tertiary: {
        color: '$colorTextTertiary',
      },
    },
    weight: {
      black: {
        fontWeight: '900',
      },
      bold: {
        fontWeight: '700',
      },
      medium: {
        fontWeight: '500',
      },
      regular: {
        fontWeight: '400',
      },
    },
  } as const,
});
