import { Stack, styled } from '@tamagui/core';
const Circle = styled(Stack, {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$12',
  overflow: 'hidden',
  backgroundColor: '$background-alternative-color-4',
  variants: {
    size: {
      '...size': (size, { tokens }) => {
        return {
          width: tokens.size[size] ?? size,
          height: tokens.size[size] ?? size,
        };
      },
    },
  },
});
export { Circle };
//# sourceMappingURL=Circle.js.map
