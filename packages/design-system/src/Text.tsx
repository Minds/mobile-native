import { styled } from '@tamagui/core';
import { Paragraph } from '@tamagui/text';

export const Text = styled(Paragraph, {
  tag: 'span',
  name: 'Text',
  fontFamily: '$body',
  size: '$b',
  // margin: 0,
  variants: {
    type: {
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
  defaultVariants: {
    fontWeight: '400',
  },
});
