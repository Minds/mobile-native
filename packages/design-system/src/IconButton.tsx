import { ComponentProps } from 'react';
import { ButtonFrame } from './Button';
import { Icon, IconNames } from './icons';

type IconButtonProps = ComponentProps<typeof ButtonFrame> & {
  name: IconNames;
};

export function IconButton({ name, ...props }: IconButtonProps) {
  return (
    <ButtonFrame circular {...props} type="basic" mode="simple">
      <Icon name={name} />
    </ButtonFrame>
  );
}
