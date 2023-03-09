import { styled, Stack } from '@tamagui/core';

export const Layout = styled(Stack, {
  tag: 'Layout',
  backgroundColor: '$background',
  flex: 1,
});

export const Row = styled(Stack, {
  tag: 'Row',
  fd: 'row',
});

export const Column = styled(Stack, {
  tag: 'Row',
  fd: 'column',
});

export { Stack as View };
