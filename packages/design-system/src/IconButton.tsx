import React, { ComponentProps } from 'react';
import { ButtonFrame } from './Button';
import { Icon, IconNames } from './icons';

type IconButton = ComponentProps<typeof ButtonFrame> & {
  name: IconNames;
};

export function IconButton({ name, ...props }: IconButton) {
  return (
    <ButtonFrame circular {...props} type="secondary" base>
      <Icon name={name} />
    </ButtonFrame>
  );
}
