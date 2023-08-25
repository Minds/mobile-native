import React from 'react';
import { GetProps, styled, TamaguiElement } from '@tamagui/core';
import { Avatar as TAvatar } from '@tamagui/avatar';
import { Image } from '@tamagui/image';

const AvatarFrame = styled(TAvatar, {
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
    resizeMode="cover"
    width="100%"
    height="100%"
    // to confirm the default cdn for the minds icon
    source={{
      uri: 'https://design-system-v2-0-0.oke.minds.io/icon/1403367290623234053/medium/1659964835',
    }}
  />
));

export type AvatarProps = GetProps<typeof AvatarFrame> & {
  url?: string;
};

export const Avatar = AvatarFrame.extractable(
  React.forwardRef<TamaguiElement, AvatarProps>(({ url, ...props }, ref) => {
    return (
      <AvatarFrame ref={ref} {...props}>
        <TAvatar.Image src={url} />
        <TAvatar.Fallback bc="$yellow-300-alt">
          <DefaultImage />
        </TAvatar.Fallback>
      </AvatarFrame>
    );
  }),
);
