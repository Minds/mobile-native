import { GetProps, Stack, styled } from '@tamagui/core';

export const Circle = styled(Stack, {
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
  } as const,
});
export type CircleProps = GetProps<typeof Circle>;
