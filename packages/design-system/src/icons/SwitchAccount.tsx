/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path } from 'react-native-svg';
import { themed } from '../config/themed';

const Icon = (props: IconProps) => {
  const { color = 'black', size = 32, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={`${color}`}
      {...otherProps}>
      <Path
        d="M8 10H6V24C6 25.1 6.9 26 8 26H22V24H8V10ZM24 6H12C10.9 6 10 6.9 10 8V20C10 21.1 10.9 22 12 22H24C25.1 22 26 21.1 26 20V8C26 6.9 25.1 6 24 6ZM18 8C19.66 8 21 9.34 21 11C21 12.66 19.66 14 18 14C16.34 14 15 12.66 15 11C15 9.34 16.34 8 18 8ZM24 20H12V18.5C12 16.51 16 15.5 18 15.5C20 15.5 24 16.51 24 18.5V20Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'SwitchAccount';

export const SwitchAccount = memo<IconProps>(themed(Icon));
