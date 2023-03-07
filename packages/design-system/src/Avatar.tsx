import React from 'react';
import { GetProps, styled } from '@tamagui/core';
import { Avatar as TAvatar } from '@tamagui/avatar';
import { Image } from '@tamagui/image';

export const Avatar = ({ url, ...props }: AvatarProps) => {
  return (
    <StyledAvatar {...props}>
      <TAvatar.Image src={url} />
      <TAvatar.Fallback bc={'$yellow-300-alt'}>
        <DefaultImage />
      </TAvatar.Fallback>
    </StyledAvatar>
  );
};

export type AvatarProps = GetProps<typeof StyledAvatar> & {
  url?: string;
};

const StyledAvatar = styled(TAvatar, {
  name: 'Avatar',
  circular: true,

  variants: {
    sSize: {
      m: { size: 32 },
      l: { size: 64 },
      xl: { size: 96 },
    },
    bordered: {
      true: {
        borderWidth: 1,
        borderColor: '$colorTextSecondary',
      },
    },
  } as const,
  defaultVariants: {
    sSize: 'm',
    bordered: false,
  },
});

const DefaultImage = React.memo(() => (
  <Image
    resizeMode={'cover'}
    width={'100%'}
    height={'100%'}
    // to confirm the default cdn for the minds icon
    src={
      'https://design-system-v2-0-0.oke.minds.io/icon/1403367290623234053/medium/1659964835'
    }
  />
));
