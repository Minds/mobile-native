import { styled } from '@tamagui/core';
import { Paragraph } from '@tamagui/text';
const Text = styled(Paragraph, {
  tag: 'span',
  name: 'Text',
  fontFamily: '$body',
  size: '$b',
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
  },
  defaultVariants: {
    fontWeight: '400',
  },
});
export { Text };
//# sourceMappingURL=Text.js.map
